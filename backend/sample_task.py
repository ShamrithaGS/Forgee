import csv

with open('/work/readings.csv', newline='', encoding='utf-8') as file:
    readings = csv.DictReader(file)
    flagged = [row for row in readings if float(row['vibration_mm_s']) > 4.5]

print(f'FLAGGED {len(flagged)} reading(s) above 4.5 mm/s')
for row in flagged:
    print(f"{row['equipment_id']}: {row['vibration_mm_s']} mm/s")
