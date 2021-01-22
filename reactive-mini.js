

class Reactive {

    // asigna evento observer, si ya se encuentra lo ignora
    deps = new Map();
    cacheFor = new Map();
    triggerHas = [];
    // func = new Map();
    constructor(options) {
        this.origin = options.data(); // callback que contiene  los datos iniciales de la vista

        if (options.functions) { // asignar clase solo si existe
            this.externalClass = new options.functions();
        }
        const self = this; // reaccion de this con self, mayor consistencia que this

        // Listener de las variables a traves de un proxy 
        this.$data = new Proxy(this.origin, {
            get(target, name) {
                if (Reflect.has(target, name)) {
                    const aux = Reflect.get(target, name);
                    self.track(target, name)
                    return aux
                }
                console.warn(`no se encuentra la key [${name}]`);
                return ""
            },
            set(target, name, value) {
                const aux = Reflect.set(target, name, value);
                self.trigger(name)
                return aux;
            }
        });
    }



    // Inicia el ciclo de vida 
    mount() {
        document.querySelectorAll("*[m-text]").forEach(el => {
            this.mText(el, this.$data, el.getAttribute("m-text"))
        })
        document.querySelectorAll("*[m-model]").forEach((el) => {
            const name = el.getAttribute('m-model');
            this.mModel(el, this.$data, name)
            el.addEventListener('input', () => {
                Reflect.set(this.$data, name, el.value);
            })
        })
        document.querySelectorAll('*[m-bind]').forEach(el => {
            const attribute = el.getAttribute('m-bind');
            this.mBind(el, this.$data, attribute)
        })
        document.querySelectorAll('*[m-if]').forEach(el => {
            const attribute = el.getAttribute('m-if');
            this.mIf(el, this.$data, attribute)
        })
        document.querySelectorAll('*[m-for]').forEach(el => {
            const value = el.getAttribute('m-for');
            let [origen, cursor] = value.split('as').map(item => item.trim());
            this.mFor(this.$data, origen, cursor, el)
        })
        this.setIfs('*[m-if]');
        this.setEvents('*[m-on]');
    }



    // elementos iterativos
    setEvents(query) {
        document.querySelectorAll(query).forEach(el => {
            const attribute = el.getAttribute('m-on');
            const [event, callback] = attribute.split(':').map(x => x.trim())
            this.mOn(el, event, callback)
        })
    }

    setIfs(query) {
        document.querySelectorAll(query).forEach(el => {
            const attribute = el.getAttribute('m-if');
            this.mIf(el, this.$data, attribute)
        })
    }

    forTrack(name) {
        document.querySelectorAll(`#${name}`).forEach(el => {
            const value = el.getAttribute('m-for');
            let [origen, cursor] = value.split('as').map(item => item.trim());
            this.mFor(this.$data, origen, cursor, el)
        })
    }

    //Reactividad de los elementos
    track(target, name) {
        let effect;
        if (!this.deps.has(name)) {
            if (Array.isArray(Reflect.get(target, name))) {
                effect = () => this.forTrack(name);
            }
            if (this.isSelectorNotEmpty(`*[m-if="${name}"]`)) {
                effect = () => document.querySelectorAll(`*[m-if="${name}"]`).forEach(el => this.mIf(el, target, name))
            }
            else {
                effect = () => document.querySelectorAll(`*[m-text="${name}"]`).forEach(el => this.mText(el, target, name))
            }
            this.deps.set(name, effect)
        }
    }

    isSelectorNotEmpty(query) {
        return Boolean([...document.querySelectorAll(query)].length)
    }

    trigger(name) {
        const effect = this.deps.get(name);
        effect();
    }

    //Directivas de la aplicacion
    mOn(el, event, funcName) {
        el.removeEventListener(event, this.externalClass[funcName]?.bind(this.$data))
        el.addEventListener(event, this.externalClass[funcName]?.bind(this.$data))
    }

    mText(el, target, name) {
        el.innerText = Reflect.get(target, name)
    }

    mModel(el, target, name) {
        el.value = Reflect.get(target, name)
    }

    mBind(el, target, attr) {
        const [attribute, key] = attr.split(':')
        el.setAttribute(attribute, Reflect.get(target, key))
    }

    mFor(target, key, cursor, el) {
        const values = Reflect.get(target, key)
        this.cacheChildView(el)
        el.innerHTML = this.childFor(values, cursor, el.id)
        this.setEvents('*[m-for] *[m-on]');
        this.setIfs('*[m-for] *[m-if]');
        this.mForSon(el)
    }
    mForSon(el) {
        document.querySelectorAll(`#${el.id} *[m-for-son]`).forEach(el => {
            let propierties = el.getAttribute('m-for-son').split(',')
            if (!propierties[0].length) {
                el.remove()
            } else {
                let clone;
                propierties.forEach(em => {
                    clone = el.cloneNode(true)
                    clone.textContent = em
                    clone.removeAttribute('m-for-son')
                    el.parentNode.append(clone)
                })
                el.parentNode.removeChild(el)
            }
        })
    }
    mIf(el, target, name) {
        let is;
        if (name == 'true' || name == "false") {
            is = name == 'true';
        } else {
            is = Reflect.get(target, name);
        }
        if (is) {
            el.style.display = ''
        } else {
            el.style.display = 'none'
        }
    }

    cacheChildView({ id }) {

        if (!this.cacheFor.has(id)) {
            const childs = []
            document.querySelectorAll(`#${id} >  *`).forEach(el => {
                childs.push(el.outerHTML)
            })
            const cacheViews = []
            for (const itemHTML of childs) { // ocupa cashing                
                cacheViews.push(itemHTML.split(/[{]{2}(.*)[}]{2}/))
            }
            this.cacheFor.set(id, cacheViews)
        }
    }

    childFor(values, cursor, id) {
        let htmlResult = '';
        let result = []
        let cache = this.cacheFor.get(id)
        console.log(cache)
        for (const iterator of values) {
            // if (Array.isArray(values)) { 

            // }
            if (cache.length <= 1) {
                let index = 0
                let cache2 = cache.flat();
                for (const view of cache2) {
                    // const valueResult = [...view]
                    if (index % 2 == 0) {
                        result.push(view);
                        index++
                        continue
                    }
                    else {
                        let key = view?.replace(`${cursor}.`, '').trim()
                        // valueResult[1] = iterator[key]
                        const aux = iterator[key]
                        result.push(iterator[key]);
                    }
                    index++;

                }
            } else {
                for (const view of cache) {
                    const valueResult = [...view]
                    const key = view[1]?.replace(`${cursor}.`, '')
                    valueResult[1] = iterator[key]
                    htmlResult += valueResult.join('')
                }
            }
        }
        return htmlResult ? htmlResult : result.join('');
    }
}

//instancia de la clase que se comparte 
export default function createApp(options) {
    return new Reactive(options);
}


