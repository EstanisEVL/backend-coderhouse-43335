# Repositorio de desafíos entregables para el curso de Programación Backend de Coderhouse - comisión 43335

##### Actualizado a: clase 27

---

### Índice:

1. [Estructura del proyecto](#structure).
2. [Variables de entorno](#environments).
3. [Cómo ejecutar la aplicación](#starting).


---

### Estructura del proyecto: {#structure}

src

└─── config         # carga de variables de entorno para desarrollo, testing y producción.

└─── controllers    # controladores que se comunican con los servicios, con validaciones y middlewares.

└─── dao 

├───└─── managers   # managers

└───└─── models     # modelos de la base de datos (MongoDb)

└─── middlewares     # operaciones que controlan o manipulan las peticiones a procesar por el controlador

└─── public

├───└─── assets    # iconos e imágenes

└───└─── css       # estilos CSS

└─── routes          # rutas de Express.js que definen la estructura de la API

└─── services        # intercede entre el controlador y la capa de persistencia, y utiliza los modelos.

└─── utils           # funciones y métodos utilitarios

└─── views           # vistas de Handlebars

app.js          # punto de entrada de la aplicación

---

### Variables de entorno: {#environments}

La aplicación soporta tres entornos: **development**, **testing** y **production**. Las variables de cada entorno se encuentran en los archivos .env correspondientes y contienen:

```
PORT
MONGO_USER
MONGO_PASSWORD
MONGO_URL
ADMIN_EMAIL
ADMIN_PASSWORD
SECRET_JWT
```

---

### Cómo ejecutar la aplicación: {#starting}

Teniendo los archivos .env correctamente configurados, podés correr la aplicación, en cualquiera de sus entornos, ejecutando el comando `npm run start:<entorno>`. Las opciones de entorno pueden ser `dev`, `test` o `prod`.