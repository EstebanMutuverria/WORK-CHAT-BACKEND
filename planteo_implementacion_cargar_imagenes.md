## Implementacion para cargar imagenes en el sistema

Actualmente en el registro de un nuevo espacio de trabajo la propiedad de la url_image se esta llenando con texto, lo cual no es correcto, ya que deberia ser una url de una imagen.

Quiero que implementes toda la funcionalidad que tenga que ver con la carga de imagenes en la creacion de workspaces y que se muestren como imagenes en el listado de espacios de trabajos y en el detalle del espacio de trabajo.

Vas a tener que modificar el modelo, el servicio, el repositorio, el controlador y el frontend del los espacios de trabajo. 

No te olvides de que el espacio de trabajo debe tener un icono (la imagen o en su defecto una imagen pro defecto si es que el usuario no le carga una imagen.) que se muestre en el listado de espacios de trabajo y en el detalle del espacio de trabajo.

Aclaracion, ese campo 'url_image' va a ser opcional. 