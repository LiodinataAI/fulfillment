import csv, json

# Nama file input & output
csv_file = "sites.csv"
geojson_file = "sites_detail.geojson"

features = []
with open(csv_file, newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        try:
            lat = float(row["Latitude"])
            lon = float(row["Longitude"])
        except:
            continue  # lewati jika gagal parsing koordinat

        # Buat GeoJSON Feature
        features.append({
            "type": "Feature",
            "properties": row,  # semua kolom dimasukkan ke popup
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            }
        })

# Simpan ke file GeoJSON
with open(geojson_file, "w", encoding="utf-8") as f:
    json.dump({
        "type": "FeatureCollection",
        "features": features
    }, f, ensure_ascii=False, indent=2)

print("✅ Konversi selesai: sites_detail.geojson dibuat.")
