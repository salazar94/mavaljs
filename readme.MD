# Maval JS 🤪🤪

### Directivas ⚙ 

#### m-for
--------
Itera los elementos en el template
se especifica  el id con el nombre del modelo
```html
 <main class="card-container" m-for="jobs as job" id="jobs">
       <div class="card-body-logo">
             <img class="card-body-logo__img" src="{{job.logo}}" alt="logo enterprise" />                    
        </div>
</main>
```

### m-for-child
Algunas veces los arreglos contienen elementos dentro de si ej.
``` javascript
const model = {
    user : [{...},{
            name: 'tony'
            languages: ["HTML", "CSS", "JavaScript"]
            }]
 }
```
```html
   
<main class="card-container" m-for="jobs as job" id="jobs">
       <div class="card-body-logo">
             <img class="card-body-logo__img" src="{{job.logo}}" alt="logo enterprise" />                    
        </div>
        <div class="card-body-tags" >
            <button class="btn" m-for-son="{{job.languages}}"></button>
        </div>
</main>
```

`Renderizado`
```html
<button class="btn" >HTML</button>
<button class="btn" >CSS</button>
<button class="btn" >Javascript</button>
```
### m-If
-------
renderiza el elemento si se cumple la variable booleana

```html
  <span class="breadcrumb header-title__new" m-if="isNew">New!</span>
```
>  dentro de un for se agrega llaves
```html
 <span class="status header-title" m-if="{{job.hasInsurance}}">👍</span>
```

### m-model
----------
Se asigna el valor de a una variable dentro del modelo
y con [`m-text`](https://github.com/pandao/editor.md ) se puede ver reflejada 

```html
 <input m-model="nombre" type="text" name="name" id="name">
 <span m-text="nombre" > *SE REFLEJA NOMBRE</span>
```

### m-text
-------
Refleja los datos del modelo
```javascript
const modelo = {
    nombre : 'tony'
}
```

```html
<label for="user" m-text=""></label>
```
`Renderizado mostraria lo siguiente`
```html
<label for="user" m-text="nombre">tony</label>
```

### m-bind
-----------
Asigna attributos  a los elementos html, primero el atributo que se va agregar seguido del dato en el modelo 
m-bind = "attribute:modelo" 

```javascript
const model = {
    descripcion : 'imagen de carros'
}
```

```html
<img class="img" m-bind="alt:descripcion" ></img>
```

### m-on
---------

asignar listener a elementos DOM, dentro del elemento se agrega la etiqueta 
m-on = "evento:metodo del controlador"

```javascript
class controlador {
    delete(ev){
        this.user = this.user.filter(user => user.id !== id);
    }
}
```

```html
<button class="btn btn-primary" m-on="click:delete" >Eliminar</buttom>
```
***Se debe eliminar el on de los eventos, Ej..***
> onclick = click

> oninput = input
