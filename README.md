# WordPress Media Uploader

Inpired on [amostajo/wordpress-media-uploader](https://github.com/amostajo/wordpress-media-uploader), this jquery library converts any DOM element into a media uploader input.

The Media Uploader will pop-up WordPress Media Library, and will allow to upload and or select uploaded media from the library.

Content:

 * [Install](#install)
 * [Basic usage](#basic-usage)
    * [Enqueue](#enqueue)
    * [Via HTML](#via-html)
    * [Via Javascript](#via-javascript)
 * [Options](#options)
    * [HTML attributes](#html-attributes)
    * [target](#option-target)
        * [after](#after)
        * [inside](#inside)
        * [DOM selector](#selector)
    * [mediaFilter](#option-mediafilter)
    * [mediaMap](#option-mediamap)
    * [mediaLoad](#option-mediaload)
 * [Events](#events)
 * [Methods](#methods)
 * [Templating](#templating)

## Install

Via *npm*:
```
npm install wp-media-uploader
```

Or download release and add it into your project.

## Basic usage

### Enqueue

First enqueue script and media dependnecies:

```php
// (1) Make sure WP media gallery is enqueued
wp_enqueue_media();

// (2) Enqueue "Wordpress Media Uploader"
wp_enqueue_script(
    'wp-media-uploader',
    PATH_TO_FILE . '/jquery.wp-media-uploader.min.js',
    [ 'jquery', 'jquery-ui-core' ],
    '1.0.0',
    true
);
```

If you want the plugin to load select attachments and render them for you, add `wp-api` as dependency:
```php
// (1) Make sure WP media gallery is enqueued
wp_enqueue_media();

// (2) Enqueue "Wordpress Media Uploader"
wp_enqueue_script(
    'wp-media-uploader',
    PATH_TO_FILE . '/jquery.wp-media-uploader.min.js',
    [ 'jquery', 'jquery-ui-core', 'wp-api' ],
    '1.0.0',
    true
);
```

### Via HTML

Instantiate via HTML by adding attribute `role="media-uploader"`, additionally, you can configure all options via `data` attributes:
```html
<a role="media-uploader"
    data-editor="my-editor"
>
    Add Media
</a>
```

### Via Javascript

To instantiate via Javascript, first add an element in the DOM:
```html
<a id="my-uploader">Add Media</a>
```
Then call to `wp_media_uploader` jQuery plugin:
```javascript
$( '#my-uploader' ).wp_media_uploader( options );
```

## Options

The following is the list of available jQuery plugin `options`:

| Option | Type | Description |
| --- | --- | --- |
| `name` | `string` | Input name. Required if this will be used inside a form. |
| `value` | `string` | Input value. Values separated by commas when using the `multiple` option. |
| `editor` | `string` | Editor ID. Default: *the plugin will assign a unique ID* |
| `target` | `string` | Expected values `after`, `inside` or a DOM selector. This identifies where the selected will be rendered. Default: `after` |
| `render` | `bool` | Flag that indicates if selected results should be rendered inside target or not. Default: `true` |
| `multiple` | `bool` | Flag that indicates if multiple selection is allowed. Default: `false` |
| `clearOnSelection` | `bool` | Flag that indicates if results in target should be cleared once a new selection is made, if set to `false`, results will be appended. The plugin will force this option to `true` when the `multiple` option is set to `false`. Default: `true` |
| `title` | `string` | Title to display on top of the media uploader modal. |
| `buttonText` | `string` | Selection button text to display inside the media uploader modal. |
| `mimeType` | `string` | Expected values `image`, `video` or empty. |
| `size` | `string` | The image size to use when rendering an image (for example: `thumbnail`, `large` or other). |
| `allowClose` | `bool` | Wether or not to allow modal to close after selection. |
| `success` | `function` | Function to use once a selection is made and after rendering. |
| `mediaFilter` | `function` | Function to use to filter selected attachments before rendering. |
| `mediaMap` | `function` | Function to use to map selected attachments before rendering. |
| `idValue` | `bool` | Whether or not to use the attachment  ID as the input value instead of a url. Default: `true` |
| `showInput` | `bool` | Whether or not to display the input. Default: `false` |
| `inputCssClass` | `string` | The CSS class(es) to assign to the input. |
| `targetCssClass` | `string` | The CSS class(es) to assign to the target. |
| `templateImage` | `string` | HTML or a DOM selector. Template to use for image-based attachments. Default: *the plugin will use an internal template* |
| `templateVideo` | `string` | HTML or a DOM selector. Template to use for video-based attachments. Default: *the plugin will use an internal template* |
| `templateFile` | `string` | HTML or a DOM selector. Template to use for file-based attachments. Default: *the plugin will use an internal template* |
| `templateEmbed` | `string` | HTML or a DOM selector. Template to use for embed-based attachments (Simple Post Gallery plugin). Default: *the plugin will use an internal template* |
| `mediaLoad` | `string` | Expectes the name of a global (`window`) function or empty. This is the callable that will be used to load the media when the plugin is ready. Default: *the plugin will user WordPress rest api (if avialable) to load the attachment (Only supports ID values).* |

### HTML attributes

The following lists the HTML attributes and their javascript option counter-part:

| HTML attrbutes | Option | Value type |
| --- | --- | --- |
| `value` | `value` | `string` |
| `name` | `name` | `string` |
| `multiple` | `multiple` | `int` (values `1` or `0`) |
| `data-editor` | `editor` | `string` |
| `data-target` | `target` | `string` |
| `data-render` | `render` | `int` (values `1` or `0`) |
| `data-clear-on-selection` | `clearOnSelection` | `int` (values `1` or `0`) |
| `data-title` | `title` | `string` |
| `data-button` | `mimeType` | `string` |
| `data-type` | `size` | `string` |
| `data-size` | `size` | `string` |
| `data-allow-close` | `allowClose` | `int` (values `1` or `0`) |
| `data-id-value` | `idValue` | `int` (values `1` or `0`) |
| `data-show-input` | `showInput` | `int` (values `1` or `0`) |
| `data-input-class` | `inputCssClass` | `string` |
| `data-target-class` | `targetCssClass` | `string` |
| `data-media-load` | `mediaLoad` | `string` |
| `data-template-image` | `templateImage` | `string` |
| `data-template-video` | `templateVideo` | `string` |
| `data-template-file` | `templateFile` | `string` |
| `data-template-embed` | `templateEmbed` | `string` |


### Option: target

This option allows you to define where is the selection going to be rendered.

#### after

*Note:* This is the default value.

Target set to `after` will make the plugin generate a unique container that will be placed right after the uploader. Selection will be rendered inside the generated `<div>`:
```javascript
$( '#my-uploader' ).wp_media_uploader();
```
```html
<button id="my-uploader">Add Media</button>
<!-- Generated "div" target will be placed here -->
```

#### inside

Target set to `inside` will make the plugin render the selection inside its own HTML element:
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    target: 'inside',
} );
```
```html
<div id="my-uploader">
    Click to add media here
    <!-- Selection will be rendered here. the text "Click to add media here" will be cleared upon selection -->
</div>
```

#### selector

Target set to a DOM selector will allow you to determine where to render the selection:
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    target: '#my-container',
} );
```
```html
<button id="my-uploader">Add Media</button>
<div id="my-container"></div>
```

### Option: mediaFilter

This option allows you to filter attachments before they are rendered, for example, the next snippet filters and returns only attachments with `url` property:
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    mediaFilter: function( attachment ) {
        return attachment.url !== undefined;
    },
} );
```

### Option: mediaMap

This option allows you to map and modify  attachments before they are rendered, for example, the next snippet maps and returns a modified attachment:
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    mediaMap: function( attachment ) {
        attachment.is_invalid = isNaN( attachment.id );
        attachment.id = 55;
        return attachment;
    },
} );
```

### Option: mediaLoad

This option allows you to set your own custom global function that will handle the initial attachments load, by default the plugin uses `wp.api` @ `media` endpoint; the next snippet uses a custom api endpoint to retrieve the attachments:
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    value: '45,65,77', // IDs separated by comma
    mediaLoad: 'custom_load_media',
} );

/**
 * @param {object} uploader The uploader instance.
 * @param {array}  values   The collection of values.
 */
window.custom_load_media = function( uploader, values )
{
    // Verify
    if ( wp === undefined || wp.api === undefined )
        return;
    // Disable uploader (to prevent selection during loading)
    uploader.$el.prop( 'disabled', true );
    uploader.$el.addClass( 'loading' );
    uploader.$el.attr( 'disabled', 'disabled' );
    // Make request
    wp.apiRequest( {
        path: 'custom_namespace/v1/custom_endpoint',
        method: 'GET',
        data: {
            values: values,
        },
    } )
    .then( function( data ) {
        var attachments = [];
        // Process data
        for ( var i in data ) {
            // This is the minumin media properties expected to fill
            var media = {
                _model: undefined,
                id: data[i].id,
                type: data[i].type,
                url: data[i].url,
            };
            if ( data[i].alt_text )
                media.alt = data[i].alt_text;
            if ( uploader.options.size
                && data[i].sizes
                && data[i].sizes[uploader.options.size]
            )
                media.url = data[i].sizes[uploader.options.size];
            attachments.push( media );
        }
        uploader.render( attachments );
        // Enable uploader
        uploader.$el.prop( 'disabled', false );
        uploader.$el.removeAttr( 'disabled' );
        uploader.$el.removeClass( 'loading' );
    } );
}
```

You can also stop the plugin from loading media by sending and empty string as parameter. For instance, this is useful if you plan to add load the attachment with PHP.
```javascript
$( '#my-uploader' ).wp_media_uploader( {
    value: '45,65,77',
    mediaLoad: '',
    target: '#my-container'
} );
```
```html
<a id="my-uploader">Add Media</a>
<div id="my-container">
    <?php if ( $attachment ) : ?>
        <div id="<?php echo esc_attr( $attachment->ID ) ?>" class="attachment">
            <!-- custom template-->
        </div>
    <?php endif ?>
</div>
```

**IMPORTANT**: If you will load the attachment(s) via PHP, make sure the markup is wrapped inside a div with the following attributes `id="{attachment_id}"` and `class="attachment"`.

## Events

List of events:

| Event | Parameters | Description |
| --- | --- | --- |
| `uploader:ready` | *values*, *uploader* | Triggered when the plugin has initialized and it is ready. |
| `uploader:open` | *uploader* | Triggered after WordPress media modal is called and opened. |
| `uploader:render.before` | *uploader* | Triggered before rendering. |
| `uploader:render.after` | *uploader* | Triggered after rendering. |
| `uploader:render` | | Triggered after rendering (no parameters). |
| `uploader:attachments` | *array*, *uploader* | Triggered after attachments have been selected, filtered and mapped. Before rendering. |
| `uploader:selection` | *array*, *uploader* | Triggered after rendering. The array is the raw collection of models returned by WordPress media uploader modal and not the list of attachements proccessed by the plugin. |
| `uploader:clear` | | Triggered after selection has been cleared. Also triggers `uploader:attachments` and `uploader:selection`. |

### Event usage

```javascript
$( '#my-uploader' ).on( event, handler );
```

Examples:
```javascript
$( '#my-uploader' ).on( 'uploader:ready', function() {
    alert( 'Ready!' );
} );

$( '#my-uploader' ).on( 'uploader:attachments', function( event, attachments, uploader ) {
    console.log( attachments );
    uploader.$el.hide();
} );
```

## Methods

List of methods:

| Method | Parameters | Description |
| --- | --- | --- |
| `destroy` | | Destroys plugin instance. |
| `clear` | | Clears current selection. |

Usage example:
```javascript
$( '#my-uploader' ).wp_media_uploader( 'destroy' );
```

## Templating

### Templating using external selector

The best way to explain templating is with a case scenario.

The following snippets will customize the plugin to use `jquery-ui-sortable` to enabled sorting inside the target, to allow sorting ofrendered results using drag-and-drop. The image template will be replaced to add an extra remove button, so selected media can be removed from selection.

#### (1) Enqueue sortable and add WP.API dependency

The following sample, will enqueue the plugin, plus `wordpress media`, `jquery-ui-sortable` and `wp-api`.
```php
wp_enqueue_media();
wp_enqueue_script(
    'wp-media-uploader',
    PATH_TO_FILE . '/jquery.wp-media-uploader.min.js',
    [ 'jquery', 'jquery-ui-core', 'jquery-ui-sortable', 'wp-api' ],
    '1.0.0',
    true
);
```

#### (2) Uploader initialized via HTML

The following sample will initialize the uploader input via HTML. The PHP value passed as attribute is validated first, to see if is an array or not, and if so, the value is passed as a comma separated list. `sortable` css class will be added to the generated target. The template inside `#gallery-image` will be used to render all selected images. `data-clear-on-selection` will allow for new selection to be appended to the target.
```html
<div id="gallery" class="gallery-container">
    <button role="media-uploader"
        id="gallery"
        type="button"
        class="button"
        name="gallery"
        value="<?php echo esc_attr( is_array( $gallery ) ? implode( ',', $gallery ) : $gallery ) ?>"
        multiple="multiple"
        data-type="image"
        data-editor="gallery"
        data-clear-on-selection="0"
        data-target-css="sortable"
        data-template-image="#gallery-image"
    ><?php echo __( 'Add Media' ) ?></button>
</div>
<script id="gallery-image" type="text/template">
    <div class="attachment">
        <img><input type="text"/>
        <span class="remove">&times;</span>
    </div>
</script>
```

#### (3) Init sortable on ready event

The following sample will initialize `sortable` once the plugin is ready and has generated the target `<div>`.
```javascript
$( '#my-uploader' ).on( 'uploader:ready', function( event, uploader ) {
    if ( uploader.$target.hasClass( 'sortable' ) )
        uploader.$target.sortable();
} );
```

#### (4) Add remove behavior

The following sample will allow to remove attachments.
```javascript
$( document ).on( 'click', '.attachment .remove', function( event ) {
    event.preventDefault();
    if ( confirm( 'Do you really want to remove this item?' ) ) {
        $( this ).closest( '.attachment' ).remove();
    }
} );
```

### Templating using attributes

Another way of templating is by using the `data-template-image`, `data-template-video`, `data-template-file`, and `data-template-embed` attributes.

The plugin will look for the following selectors inside the template to append data:

| Selector | Behavior |
| --- | --- |
| `input` | The plugin will add the media's value in the `value` attribute of the `input` element. The plugin will add the `name` attribute with the respective name. |
| `.inject-media-id` | The plugin will put the media's ID inside the element with this selector. |
| `.inject-media-url` | The plugin will put the media's URL inside the element with this selector. |
| `.inject-media-filename` | The plugin will put the media's filename inside the element with this selector. |
| `img` | **ONLY FOR IMAGE AND EMBED** The plugin will add the media's URL in the `src` attribute of the element. If the media has an `alt` text, the plugin will add the media's alt text in the `alt` attribute of the element. |
| `source` | **ONLY FOR VIDEO** The plugin will add the media's URL in the `src` attribute of the element. |

Any template passed through as an attribute must be wrapped in an extra `<div>` wrapper element. For example:
```html
<div><div class="attachment type-file"><span class="inject-media-filename"></span><input type="hidden"/></div><div>
```

Above, the template is wrapped in a `<div>` which holds another `<div>` with the CSS classes `attachment type-file`, this second `<div>` is the one that will be used for rendering. Additionally, the media's filename will be injected inside the `<span>` with the class `inject-media-filename` and will add the media's value as an attribute on the `input` element.

There rendered output will look like this:
```html
<div class="attachment type-file" id="123"><span class="inject-media-filename">filename.jpg</span><input type="hidden" value="123"/></div>
```

Finally, this is how uploader initialization will look like:
```html
<div role="media-uploader"
    name="test"
    multiple="multiple"
    data-editor="test"
    data-template-file='<div><div class="attachment type-file"><span class="inject-media-filename"></span><input type="hidden"/></div><div>'
><?php echo __( 'Add Media' ) ?></div>
```

## License

MIT - (c) 2022 [10 Quality Studio](https://www.10quality.com/).