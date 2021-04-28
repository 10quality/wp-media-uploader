/*!
 * WordPress Media Uploader.
 * jQuery plugin and script.
 * @author 10 Quality Studio <https://www.10quality.com/>
 * @version 1.0.2
 * @license MIT
 */
( function( $ ) {
    /**
     * jQuery plugin.
     * @since 1.0.0
     *
     * @param {object} options
     *
     * @return {object}
     */
    $.fn.wp_media_uploader = function( options )
    {
        /**
         * Check external function requests.
         * @since 1.0.0
         * @throws error
         */
        if ( typeof options === 'string' ) {
            if ( window.media_uploaders === undefined )
                throw '001: No Media Uploader has been initialized';
            var id = $( this ).attr( 'id' );
            if ( window.media_uploaders[id] === undefined )
                throw '002: No Media Uploader has been initialized on DOM element #' + id;
            if ( window.media_uploaders[id][options] === undefined
                || typeof window.media_uploaders[id][options] !== 'function'
            )
                throw '003: Function call does not exist';
            window.media_uploaders[id][options]();
        }
        /**
         * Check if a reference for this component already exists.
         * @since 1.0.2
         */
        var id = $( this ).attr( 'id' );
        if ( window.media_uploaders !== undefined && id && window.media_uploaders[id] !== undefined )
            return window.media_uploaders[id];
        /**
         * Self reference.
         * @since 1.0.0
         */
        var self = this;
        self.$el = $( this );
        /**
         * WordPress media frame.
         * @since 1.0.0
         * @see wp.media
         * @var {object}
         */
        var frame = undefined;
        /**
         * DOM element where to render results.
         * @since 1.0.0
         */
        self.$target = undefined;
        /**
         * Template used to render.
         * @since 1.0.0
         */
        self.templates = {
            image: undefined,
            video: undefined,
            file: undefined,
            embed: undefined,
            inside: undefined,
        };
        /**
         * Plugin options.
         * @since 1.0.0
         * @var {object}
         */
        self.options = $.extend( {
            /**
             * Input name
             * @var {string}
             */
            name: self.$el.attr( 'name' ) || undefined,
            /**
             * Input value
             * @var {string}
             */
            value: self.$el.attr( 'value' ) || undefined,
            /**
             * ID of The Media Gallery uploader.
             * @var {string}
             */
            editor: self.$el.data( 'editor' ) || undefined,
            /**
             * Element set as target placeholder for media results.
             * @var {string}
             */
            target: self.$el.data( 'target' ) || 'after',
            /**
             * Flag that indicates if plugin should render results. 
             * @var {bool}
             */
            render: self.$el.data( 'render' ) !== undefined ? self.$el.data( 'render' ) : true,
            /**
             * Flag that indicates if multiple results are expected. 
             * @var {bool}
             */
            multiple: self.$el.attr( 'multiple' ) !== undefined ? self.$el.attr( 'multiple' ) : false,
            /**
             * Flag that indicates results should be cleared when a new selection is being rendered.
             * @var {bool}
             */
            clearOnSelection: self.$el.data( 'clear-on-selection' ) !== undefined ? self.$el.data( 'clear-on-selection' ) : true,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateImage: self.$el.data( 'template-image' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateVideo: self.$el.data( 'template-video' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateFile: self.$el.data( 'template-file' ) || undefined,
            /**
             * Template DOM element or HTML string.
             * @var {string}
             */
            templateEmbed: self.$el.data( 'template-embed' ) || undefined,
            /**
             * Title that will appear on top of the media uploader.
             * @var {string}
             */
            title: self.$el.data( 'title' ) || undefined,
            /**
             * Button text.
             * @var {string}
             */
            buttonText: self.$el.data( 'button' ) || undefined,
            /**
             * Mime type (image or video).
             * @var {string}
             */
            mimeType: self.$el.data( 'type' ) || undefined,
            /**
             * The attachment size to select if available
             * @var {string}
             */
            size: self.$el.data( 'size' ) || undefined,
            /**
             * Wether or not to allow modal to close after selection.
             * @var {string}
             */
            allowClose: self.$el.data( 'allow-close' ) !== undefined ? self.$el.data( 'allow-close' ) : true,
            /**
             * Callback function with media results as parameter, called after render process has finished.
             * @var {function}
             */
            success: undefined,
            /**
             * Callback function that filters captured media before rendering.
             * @var {function}
             */
            mediaFilter: undefined,
            /**
             * Callback function that maps captured media before rendering.
             * @var {function}
             */
            mediaMap: undefined,
            /**
             * Whether or not to receive an ID value instead of a url.
             * @var {string}
             */
            idValue: self.$el.data( 'id-value' ) !== undefined ? self.$el.data( 'id-value' ) : true,
            /**
             * Whether or not to display input.
             * @var {string}
             */
            showInput: self.$el.data( 'show-input' ) !== undefined ? self.$el.data( 'show-input' ) : false,
            /**
             * Attachment input CSS class.
             * @var {string}
             */
            inputCssClass: self.$el.data( 'input-class' ) || undefined,
            /**
             * Target CSS class.
             * @var {string}
             */
            targetCssClass: self.$el.data( 'target-class' ) || undefined,
            /**
             * Target CSS class.
             * @var {string}
             */
            mediaLoad: self.$el.data( 'media-load' ) !== undefined ? ( self.$el.data( 'media-load' ) ? self.$el.data( 'media-load' ) : undefined ) : 'wp.api',
        }, options );
        /**
         * Creates a unique ID.
         * @since 1.0.0
         * 
         * @link https://stackoverflow.com/questions/4872380/uniqid-in-javascript-jquery
         *
         * @param {string} prefix
         * @param {bool} more_entropy
         *
         * @return string
         */
        self.uniqid = function( prefix, more_entropy )
        {
            var id = Date.now() / 1000;
            id = id.toString( 16 ).split( '.' ).join( '' );
            while( id.length < 14 ){
                id += '0';
            }
            var more = '';
            if ( more_entropy !== undefined && more_entropy === true ) {
                more = '.' + Math.round( Math.random() * 100000000 );
            }
            return ( prefix !== undefined ? prefix : '' ) + id + more;
        };
        /**
         * Inits plugin.
         * @since 1.0.0
         */
        self.ready = function()
        {
            // Init global references if needed
            if ( window.media_uploaders === undefined )
                window.media_uploaders = {};
            // Init ID if needed
            if ( self.$el.attr( 'id' ) === undefined )
                self.$el.attr( 'id', 'uploader-' + self.uniqid() );
            // Assign frame
            self.frame = wp.media.frames[self.$el.attr( 'id' )] = wp.media( {
                title: self.options.title,
                library: self.options.mimeType ? {type: self.options.mimeType} : undefined,
                button: {
                    text: self.options.buttonText,
                    close: self.options.allowClose,
                },
                multiple: self.options.multiple,
            } );
            // Assign target
            switch ( self.options.target ) {
                case 'before':
                    var target_id = 'uploader-target-' + self.uniqid();
                    $( '<div id="' + target_id + '"></div>' ).insertBefore( self.$el );
                    self.$target = $( '#' + target_id );
                    break;
                case 'after':
                    var target_id = 'uploader-target-' + self.uniqid();
                    $( '<div id="' + target_id + '"></div>' ).insertAfter( self.$el );
                    self.$target = $( '#' + target_id );
                    break;
                case 'inside':
                    self.$target = self.$el;
                    break;
                default:
                    if ( $( self.options.target ).length )
                        self.$target = $( self.options.target );
                    break;
            }
            self.templates.inside = self.$target.html();
            // Stop if no target has been stablished
            if ( self.$target === undefined )
                return;
            if ( self.options.targetCssClass )
                self.$target.addClass( self.options.targetCssClass );
            // Check on templates
            var $template = undefined;
            if ( self.options.templateImage ) {
                $template = $( self.options.templateImage );
                if ( $template.length )
                    self.templates.image = $template.html();
            }
            if ( self.options.templateVideo ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.video = $template.html();
            }
            if ( self.options.templateFile ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.file = $template.html();
            }
            if ( self.options.templateEmbed ) {
                $template = $( self.options.templateVideo );
                if ( $template.length )
                    self.templates.embed = $template.html();
            }
            // Set default templates
            self.set_default_templates();
            // General options override
            if ( !self.options.multiple )
                self.options.clearOnSelection = true;
            // Bind events
            self.$el.on( 'click', self.on_click );
            self.frame.on( 'select', self.on_select );
            // Set initial values
            if ( self.options.value ) {
                self.options.value = self.options.value.split( ',' );
                if ( self.options.mediaLoad ) {
                    switch( self.options.mediaLoad ) {
                        case 'wp.api':
                            self.load_attachments( self.options.value );
                            break;
                        default:
                            window[self.options.mediaLoad]( self, self.options.value );
                            break;
                    }
                }
            }
            // Trigger
            self.$el.trigger( 'uploader:ready', [self.options.value, self] );
        };
        /**
         * Destroys plugin.
         * @since 1.0.0
         */
        self.destroy = function()
        {
            self.$target.remove();
            self.frame.detach();
            window.media_uploaders[self.$el.attr( 'id' )] = undefined;
            self = undefined;
        };
        /**
         * On selector click event handler.
         * Open frame,
         * @since 1.0.0
         *
         * @param {object} event
         */
        self.on_click = function( event )
        {
            event.preventDefault();
            if ( self.$el.is( ':disabled' ) || self.$el.hasClass( 'loading' ) )
                return;
            self.$el.trigger( 'uploader:open', [self] );
            self.frame.open();
        };
        /**
         * Renders media into target.
         * @since 1.0.0
         *
         * @param {object} media
         */
        self.render = function ( media )
        {
            if ( !self.options.render ) return;
            self.$el.trigger( 'uploader:render.before', [self] );
            if ( self.$target ) {
                if ( self.options.clearOnSelection )
                    self.$target.html( '' );
                $.each( media, function (i) {
                    // Prevent from rendering duplicated
                    if ( self.$target.find( '#' + this.id ).length )
                        return;
                    // Render
                    self.$target.append( self.render_media(this) );
                } );
            }
            // Trigger
            self.$el.trigger( 'uploader:render.after', [self] );
            self.$el.trigger( 'uploader:render' );
        }
        /**
         * Returns media as a rendered using a template.
         * @since 1.0.0
         *
         * @param {object} media
         *
         * @return {string}
         */
        self.render_media = function ( media )
        {
            $html = $( self.templates[media.type] );
            // General settings
            $html.attr( 'id', media.id );
            $html.find( 'input' ).attr( 'type', self.options.showInput ? 'text' : 'hidden' );
            if ( self.options.name )
                $html.find( 'input' ).attr( 'name', self.options.name + ( self.options.multiple ? '[]' : '' ) );
            if ( !self.options.idValue && media.url )
                $html.find( 'input' ).attr( 'value', media.url );
            if ( self.options.idValue && media.id )
                $html.find( 'input' ).attr( 'value', media.id );
            if ( self.options.inputCssClass )
                $html.find( 'input' ).addClass( self.options.inputCssClass );
            // Type specific
            switch ( media.type ) {
                case 'embed':
                case 'image':
                    $html.find( 'img' ).attr( 'src', media.url );
                    if ( media.alt )
                        $html.find( 'img' ).attr( 'alt', media.alt );
                    $html.find( 'img' ).css( 'max-width', '100%' );
                    $html.find( 'img' ).css( 'width', 'auto' );
                    $html.find( 'img' ).css( 'height', 'auto' );
                    break;
                case 'video':
                    $html.find( 'source' ).attr( 'src', media.url );
                    break;
            }
            return $html.get();
        }
        /**
         * Parse HTML captured from WordPress media library.
         * Editor callback processing function.
         *
         * @param {"array|mixed} models.
         */
        self.parse_capture = function ( models )
        {
            var attachments = [];
            // Process models
            for ( var i in models ) {
                var media = {
                    _model: models[i],
                    id: models[i].id,
                    type: models[i].get( 'type' ),
                    subtype: models[i].get( 'subtype' ),
                    mime: models[i].get( 'mime' ),
                    url: models[i].get( 'url' ),
                };
                if ( models[i].get( 'alt' ) )
                    media.alt = models[i].get( 'alt' );
                if ( self.options.size
                    && models[i].get( 'sizes' )
                    && models[i].get( 'sizes' )[self.options.size]
                )
                    media.url = models[i].get( 'sizes' )[self.options.size].url;
                if ( models[i].get( 'image' ) )
                    media.img = models[i].get( 'image' ).src;
                if ( models[i].get( 'title' ) )
                    media.title = models[i].get( 'title' );
                if ( models[i].get( 'filename' ) )
                    media.filename = models[i].get( 'filename' );
                if ( media.type !== 'image'
                    && media.type !== 'video'
                    && media.type !== 'embed'
                ) {
                    media.type = 'file';
                }
                attachments.push( media );
            }
            // Shortcode to html
            if ( self.options.mediaFilter ) {
                attachments = attachments.filter( self.options.mediaFilter );
            }
            if ( self.options.mediaMap ) {
                attachments = attachments.map( self.options.mediaMap );
            }
            if ( !self.options.multiple && attachments.length > 1 ) {
                while ( attachments.length > 1 ) {
                    attachments.pop();
                }
            }
            self.$el.trigger( 'uploader:attachments', [attachments, self] );
            self.render( attachments );
            if ( self.options.success ) {
                self.options.success( attachments );
            }
        };
        /**
         * Sets default templates if none has been provided.
         * @since 1.0.0
         */
        self.set_default_templates = function()
        {
            if ( self.templates.image === undefined ) {
                self.templates.image = '<div class="attachment type-image"><img><input type="text"/></div>';
            }
            if ( self.templates.video === undefined ) {
                self.templates.video = '<div class="attachment type-video"><video controls><source type="video/mp4"></video><input type="text"/></div>';
            }
            if ( self.templates.file === undefined ) {
                self.templates.file = '<div class="attachment type-file"><input type="text"/></div>';
            }
            if ( self.templates.embed === undefined ) {
                self.templates.embed = '<div class="attachment type-embed"><img><input type="text"/></div>';
            }
        };
        /**
         * WordPress media selection event handler.
         * @since 1.0.0
         */
        self.on_select = function()
        {
            var selection = self.frame.state().get( 'selection' );
            self.parse_capture( selection.models );
            self.$el.trigger( 'uploader:selection', [selection.models, self] );
        };
        /**
         * Loads and attachment using WordPress Rest API.
         * @since 1.0.0
         *
         * @param {array} values
         */
        self.load_attachments = function( values )
        {
            var ids = values.filter( function( id ) {
                return !isNaN( id );
            } ).map( function( id ) {
                return id.trim ? id.trim() : id;
            } );
            if ( wp && wp.api && ids.length ) {
                self.$el.prop( 'disabled', true );
                self.$el.addClass( 'loading' );
                self.$el.attr( 'disabled', 'disabled' );
                wp.apiRequest( {
                        path: 'wp/v2/media',
                        method: 'GET',
                        data: {
                            include: ids,
                            per_page: 100,
                        },
                    } )
                    .then( self.on_load_attachments );
            } else if ( values.length ) {
                var attachments = [];
                // Process models
                for ( var i in values ) {
                    attachments.push( {
                        _model: undefined,
                        id: 1,
                        type: 'file',
                        mime: undefined,
                        subtype: undefined,
                        url: values[i],
                    } );
                }
                self.render( attachments );
            }
        };
        /**
         * Handles WordPress Rest api response.
         * @since 1.0.0
         *
         * @param {array} data
         */
        self.on_load_attachments = function( data )
        {
            var attachments = [];
            // Process models
            for ( var i in data ) {
                var media = {
                    _model: undefined,
                    id: data[i].id,
                    type: data[i].media_type,
                    mime: data[i].mime_type,
                    subtype: data[i].mime_type.replace( /[a-zA-Z0-9]+\//g, '' ),
                    url: data[i].guid.rendered ? data[i].guid.rendered : data[i].guid,
                };
                if ( data[i].alt_text )
                    media.alt = data[i].alt_text;
                if ( self.options.size
                    && data[i].media_details
                    && data[i].media_details.sizes
                    && data[i].media_details.sizes[self.options.size]
                )
                    media.url = data[i].media_details.sizes[self.options.size].source_url;
                // Fix type
                if ( media.type !== 'image' )
                    media.type = data[i].mime_type.replace( /\/[a-zA-Z0-9]+/g, '' );
                if ( media.type !== 'image'
                    && media.type !== 'video'
                    && media.type !== 'embed'
                ) {
                    media.type = 'file';
                }
                attachments.push( media );
            }
            self.render( attachments );
            self.$el.prop( 'disabled', false );
            self.$el.removeAttr( 'disabled' );
            self.$el.removeClass( 'loading' );
        };
        /**
         * Clears selection,
         * @since 1.0.2
         */
        self.clear = function()
        {
            self.$target.html( '' );
            self.$target.html( self.templates.inside );
            self.$el.trigger( 'uploader:clear' );
        };
        /**
         * End plugin.
         * @since 1.0.0
         */
        self.ready();
        window.media_uploaders[self.$el.attr( 'id' )] = self;
        return self;
    };
    /**
     * DOM search and init on ready.
     */
    $( document ).ready( function() {
        $( '*[role="media-uploader"][data-editor]' ).each( function() {
            $( this ).wp_media_uploader();
        } );
    } );
} )( jQuery );