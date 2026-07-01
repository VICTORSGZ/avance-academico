# Avance Academico - JS

Aplicación web para revisar y mantener una malla académica interactiva.

## Flujo de uso

1. Abre `index.html` en el navegador.
2. Usa `mantenedor.html` para administrar, duplicar, editar o eliminar mallas y ramos.
3. Los cambios del administrador de mallas se guardan en el navegador con `localStorage`.
4. Para modificar la malla base que se carga por defecto, reemplaza o edita `data/mallas.js`.

## Archivo de malla base

La página carga la malla base con:

```html
<script src="data/mallas.js"></script>
```

Ese archivo define `window.MALLAS`, un arreglo de mallas en JavaScript. La página no necesita conversores ni archivos externos para leer las mallas base.

## Campos de cada ramo

Cada ramo debe mantener esta estructura:

- `codigo`
- `nombre`
- `semestre`
- `creditos`
- `area`
- `periodicidad`
- `prerequisitos`
- `estadoInicial`

Ejemplo:

```js
{
  codigo: 'TEC301',
  nombre: 'Desarrollo de Aplicaciones',
  semestre: 3,
  creditos: 6,
  area: 'Tecnología',
  periodicidad: 'Ambos',
  prerequisitos: ['TEC201'],
  estadoInicial: 'pendiente'
}
```

## Estados válidos

En `estadoInicial` usa:

- `aprobado`
- `inscrito`
- `pendiente`
- `bloqueado`

## Prerrequisitos

En `prerequisitos` usa un arreglo de códigos:

```js
prerequisitos: ['TEC301', 'DAT301']
```
