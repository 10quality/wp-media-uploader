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
    * [mediaFilter](#option-mediafilter)
    * [mediaMap](#option-mediamap)
    * [mediaLoad](#option-mediaload)
 * [Events](#events)
 * [Methods](#methods)

## Install

Npm command:
```
npm install ...
```

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
| `value` | `number|string` | Input value. Values separated by commas when using the `multiple` option. |
| `editor` | `string` | Editor ID. Default: *the plugin will assign a unique ID* |
| `target` | `string` | Expected values `after`, `inside` or a DOM selector. This identifies where the selected will be rendered. Default: `after` |
| `render` | `bool` | Flag that indicates if selected results should be rendered inside target or not. Default: `true` |
| `multiple` | `bool` | Flag that indicates if multiple selection is allowed. Default: `false` |
| `clearOnSelection` | `bool` | Flag that indicates if results in target should be cleared once a new selection is made, if set to `false`, results will be appended. The plugin will force this option to `true` when the `multiple` option is set to `false`. Default: `true` |
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

## Events

List of events:

| Event | Parameters | Description |
| --- | --- | --- |
| `uploader:ready` | *values*, *uploader* | Triggered when the plugin has initialized and it is ready. |
| `uploader:render.before` | *uploader* | Triggered before rendering. |
| `uploader:render.after` | *uploader* | Triggered after rendering. |
| `uploader:render` | | Triggered after rendering (no parameters). |
| `uploader:attachments` | *array*,*uploader* | Triggered after attachments have been selected, filtered and mapped. Before rendering. |
| `uploader:selection` | *array*,*uploader* | Triggered after rendering. The array is the raw collection of models returned by WordPress media uploader modal and not the list of attachements proccessed by the plugin. |

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

Usage example:
```javascript
$( '#my-uploader' ).wp_media_uploader( 'destroy' );
```

## License

MIT - (c) 2020 [10 Quality Studio](https://www.10quality.com/).