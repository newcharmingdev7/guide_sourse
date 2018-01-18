## The `{{action}}` Helper

Your app will often need a way to let users interact with controls that
change application state. For example, imagine that you have a template
that shows a blog post, and supports expanding the post with additional
information.

You can use the `{{action}}` helper to make an HTML element clickable.
When a user clicks the element, the named event will be sent to your
application.

```handlebars {data-filename=app/templates/post.hbs}
<div class='intro'>
  {{intro}}
</div>

{{#if isExpanded}}
  <div class='body'>{{body}}</div>
  <button {{action 'contract'}}>Contract</button>
{{else}}
  <button {{action 'expand'}}>Show More...</button>
{{/if}}
```

```javascript {data-filename=app/controllers/post.js}
export default Ember.Controller.extend({
  intro: Ember.computed.alias('model.intro'),
  body: Ember.computed.alias('model.body'),

  // initial value
  isExpanded: false,

  actions: {
    expand() {
      this.set('isExpanded', true);
    },

    contract() {
      this.set('isExpanded', false);
    }
  }
});
```

Note that actions may be attached to any element of the DOM, but not all
respond to the `click` event. For example, if an action is attached to an `a`
link without an `href` attribute, or to a `div`, some browsers won't execute
the associated function. If it's really needed to define actions over such
elements, a CSS workaround exists to make them clickable, `cursor: pointer`.
For example:

```css
[data-ember-action] {
  cursor: pointer;
}
```


### Action Bubbling

By default, the `{{action}}` helper triggers a method on the template's
controller, as illustrated above.

If the controller does not implement a method with the same name as the
action in its actions object, the action will be sent to the router, where
the currently active leaf route will be given a chance to handle the action.

Routes and controllers that handle actions **must place action handlers
inside an `actions` hash**. Even if a route has a method with the same name
as the actions, it will not be triggered unless it is inside an `actions` hash.
In the case of a controller, while there is deprecated support for triggering
a method directly on the controller, it is strongly recommended that you
put your action handling methods inside an `actions` hash for forward
compatibility.

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  actions: {
    expand() {
      this.controller.set('isExpanded', true);
    },

    contract() {
      this.controller.set('isExpanded', false);
    }
  }
});
```

As you can see in this example, the action handlers are called such
that when executed, `this` is the route, not the `actions` hash.

To continue bubbling the action, you must return true from the handler:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  actions: {
    expand() {
      this.controller.set('isExpanded', true);
    },

    contract() {
      // ...
      if (actionShouldAlsoBeTriggeredOnParentRoute) {
        return true;
      }
    }
  }
});
```

If neither the template's controller nor the currently active route
implements a handler, the action will continue to bubble to any parent
routes. Ultimately, if an `ApplicationRoute` is defined, it will have an
opportunity to handle the action.

When an action is triggered, but no matching action handler is
implemented on the controller, the current route, or any of the
current route's ancestors, an error will be thrown.

![Action Bubbling](/images/template-guide/action-bubbling.png)

This allows you to create a button that has different behavior based on
where you are in the application. For example, you might want to have a
button in a sidebar that does one thing if you are somewhere inside of
the `/posts` route, and another thing if you are inside of the `/about`
route.

### Action Parameters

You can optionally pass arguments to the action handler. Any values
passed to the `{{action}}` helper after the action name will be passed to
the handler as arguments.

For example, if the `post` argument was passed:

```handlebars
<p><button {{action "select" post}}>✓</button> {{post.title}}</p>
```

The controller's `select` action handler would be called with a single argument
containing the post model:

```javascript {data-filename=app/controllers/post.js}
export default Ember.Controller.extend({
  actions: {
    select(post) {
      console.log(post.get('title'));
    }
  }
});
```

### Specifying the Type of Event

By default, the `{{action}}` helper listens for click events and triggers
the action when the user clicks on the element.

You can specify an alternative event by using the `on` option.

```handlebars
<p>
  <button {{action "select" post on="mouse-up"}}>✓</button>
  {{post.title}}
</p>
```

You should use the dasherized event names.
In general, two-word event names (like `keypress`) become `key-press`.

### Specifying Whitelisted Modifier Keys

By default the `{{action}}` helper will ignore click events with
pressed modifier keys. You can supply an `allowedKeys` option
to specify which keys should not be ignored.

```handlebars
<button {{action 'anActionName' allowedKeys="alt"}}>
  click me
</button>
```

This way the `{{action}}` will fire when clicking with the alt key
pressed down.

### Default Event
By default, `event.preventDefault()` is called on all events handled by `{{action}}` helpers. To avoid this you can add `preventDefault=false` as a parameter. 

### Stopping Event Propagation

By default, the `{{action}}` helper allows events it handles to bubble
up to parent DOM nodes. If you want to stop propagation, you can disable
propagation to the parent node.

For example, if you have a **✗** button inside of a link, you will want
to ensure that if the user clicks on the **✗**, that the link is not
clicked.

```handlebars
{{#link-to 'post'}}
  Post
  <button {{action 'close' bubbles=false}}>✗</button>
{{/link-to}}
```

Without `bubbles=false`, if the user clicked on the button, Ember.js
will trigger the action, and then the browser will propagate the click
to the link.

With `bubbles=false`, Ember.js will stop the browser from propagating
the event.

### Handling an Action

The `{{action}}` helper sends the action from a component's template to
the component.

You can handle the action by adding an `actions` hash to your component
that contains a method with the name of the action.

For example, given this template that adds the `select` action to a
button:

```handlebars {data-filename=app/templates/component/show-posts.hbs}
<button {{action "select" model}}>Select Post</button>
```

You can implement a function that responds to the button being clicked
by adding an `actions` hash to your component with a method called
`select`:


```javascript {data-filename=app/components/show-posts.js}
export default Ember.Component.extend({
  actions: {
    select(post) {
      // do your business.
    }
  }
});
```

### Allowing Default Browser Action

By default, the `{{action}}` helper prevents the default browser action of the DOM event. If you want to allow the browser action, you can stop ember from preventing it.

For example, if you have a normal link tag and want the link to bring the user to another page in addition to triggering an ember action when clicked.

```handlebars
<a href="newPage.htm" {{action 'logClick' preventDefault=false}}>Go</a>
```

Without `preventDefault=false`, if the user clicked on the link, Ember.js
will trigger the action, but the user will remain on the current page.

With `preventDefault=false`, if the user clicked on the link, Ember.js
will trigger the action *and* the user will be directed to the new page.
