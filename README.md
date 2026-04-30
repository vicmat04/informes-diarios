# Informes Diarios para Windows

Proyecto con dos versiones:

- Escritorio con `tkinter`.
- Web con `Flask`, para abrirse en el navegador y empaquetarse como `.exe`.

## Funciones

- Seleccionar la fecha del informe.
- Guardar actividades frecuentes como botones.
- Seleccionar temas para registrar desarrollo de taller.
- Escribir tambien el nombre del taller en la accion de desarrollo de taller.
- Generar una convocatoria a dinamizadores escribiendo el nombre del taller.
- Agregar tareas al informe con un clic.
- Escribir actividades personalizadas.
- Copiar el informe al portapapeles.
- Descargar el informe como `.txt`, `.doc` y `.pdf` en la version web.
- Guardar el informe como archivo `.txt`.

## Cómo ejecutar

Versión escritorio:

```powershell
python app.py
```

Versión web:

```powershell
python web_launcher.py
```

## Archivos

- `app.py`: aplicación de escritorio.
- `web_app.py`: aplicación web Flask.
- `web_launcher.py`: abre la app web en el navegador.
- `actividades.json`: se crea automáticamente para guardar tus botones personalizados.

## Generar EXE de la versión web

```powershell
python -m PyInstaller --noconfirm --onefile --windowed --name InformeDiarioWeb web_launcher.py
```
