from pykml import parser

KML_FILE = '便利超商.kml'

with open(KML_FILE) as f:
    root = parser.parse(f).getroot()
placemark = root.Document.Folder.Placemark

print('INSERT INTO spots (point, name) VALUES')
for i in range(len(placemark)):
    name = placemark[i].name.text
    coordinate = ','.join(placemark[i].Point.coordinates.text.strip().split(',')[-2::-1])
    print(f"('{coordinate}', '{name}')", end='')
    print(',' if i < len(placemark) - 1 else ';')
