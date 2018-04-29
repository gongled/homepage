(function() {
    tinymce.create('tinymce.plugins.Nabla', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function(ed, url) {
            ed.addCommand('notes', function() {
                var selectedText = ed.selection.getContent();
                var editedText = prompt('Вставить заметку.', selectedText);
                if (editedText != '') {
                    var return_text = '<aside class="aside-text-right">' +  editedText + '</aside>';
                    ed.execCommand('mceInsertContent', 0, return_text);
                }

            });

            ed.addButton('notes', {
                title : 'Вставить заметку',
                cmd : 'notes',
                icon: 'anchor'
            });
        },

        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl : function(n, cm) {
            return null;
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Nabla Buttons',
                author : 'Alexandr Bizikov',
                authorurl : 'http://bizikov.ru',
                infourl : 'http://nabla.pro',
                version : "0.1"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('nabla_button', tinymce.plugins.Nabla);
})();