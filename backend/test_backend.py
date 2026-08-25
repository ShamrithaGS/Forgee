from fastapi.testclient import TestClient

from backend.main import app
from backend.ocr_pipeline import extract_fields, recommendation_for
from backend.router import ACTIVITY_LOG, route_task
from backend.sandbox import build_docker_command


def test_router_branches() -> None:
    assert route_task('inspection.jpg', '')[0] == 'vision-model'
    assert route_task('readings.csv', '')[0] == 'code-model'
    assert route_task('', 'Please import the readings and apply the threshold.')[0] == 'code-model'
    assert route_task('', 'What is the current operating posture?')[0] == 'reasoning-model'
    assert len(ACTIVITY_LOG) >= 4


def test_extracts_controlled_fields() -> None:
    text = 'Equipment ID: CDU-04\nInspection Date: 2026-08-25\nInspector: Arun S.\nFinding: Bearing shows abnormal wear\nSeverity: High'
    fields = extract_fields(text)
    assert fields['Equipment ID'] == 'CDU-04'
    assert fields['Inspection Date'] == '2026-08-25'
    assert fields['Finding'] == 'Bearing shows abnormal wear'
    assert recommendation_for(fields['Severity']).startswith('Stop or isolate')
    assert recommendation_for('not high').startswith('Human review')


def test_docker_command_is_locked_down(tmp_path) -> None:
    script = tmp_path / 'task.py'
    data = tmp_path / 'readings.csv'
    script.write_text('print(1)', encoding='utf-8')
    data.write_text('value\n1', encoding='utf-8')
    command = build_docker_command(script, [data])
    assert '--network=none' in command
    assert '--cap-drop=ALL' in command
    assert '--read-only' in command
    assert '--user' in command and '10001:10001' in command
    assert '--pids-limit=64' in command
    assert '--memory=128m' in command
    assert '--cpus=0.5' in command
    assert '--rm' in command


def test_api_rejects_unapproved_sandbox_inputs() -> None:
    client = TestClient(app)
    assert client.post('/sandbox/run', json={'script_name': '../secret.py'}).status_code == 400
    assert client.post('/sandbox/run', json={'script_name': 'sample_task.py', 'data_names': ['secret.csv']}).status_code == 400


def test_api_health_and_route() -> None:
    client = TestClient(app)
    assert client.get('/health').json() == {'status': 'ok', 'mode': 'air-gapped'}
    assert client.post('/route', json={'filename': 'inspection.jpg'}).json()['model'] == 'vision-model'
