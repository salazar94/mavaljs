Directivas ⚙ 
==========

m-for
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

m-If
-------
renderiza el elemento si se cumple la variable booleana

```html
  <span class="breadcrumb header-title__new" m-if="isNew">New!</span>
```
>  dentro de un for se agrega llaves
```html
 <span class="status header-title" m-if="{{job.hasInsurance}}">👍</span>
```

m-model
----------
Se asigna el valor de a una variable dentro del modelo
y con [`m-text`](https://github.com/pandao/editor.md ) se puede ver reflejada 

```

2.m-If

3.m-bind
4.m-model
5.m-text