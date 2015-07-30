openerp.suvit_web_list_hide_cols = function(instance, local) {
  var localStorage = window['localStorage'] || {},
      QWeb = instance.web.qweb;

  instance.web.ListView.include({
    load_hide_cols: function(){
        var data = localStorage[this.fields_view.view_id] || '{}';
        this.hide_cols = JSON.parse(data);
    },
    save_hide_cols: function(data){
        // data is map of col_name -> col_state
        localStorage[this.fields_view.view_id] = JSON.stringify(data || this.hide_cols);
    },
    setup_columns: function (fields, grouped) {
        var self = this;
        this.load_hide_cols();

        _.map(self.fields_view.arch.children, function(field){
            if (self.hide_cols[field.attrs.name] !== undefined ) {
                self.add_invisible(field, self.hide_cols[field.attrs.name]);
            }
        });

        this._super(fields, grouped);
    },
    add_invisible: function(field, is_invisible, save) {
        var modifiers = JSON.parse(field.attrs.modifiers);
        modifiers['tree_invisible'] = is_invisible ? '1' : null;
        field.attrs.modifiers = JSON.stringify(modifiers);
        this.hide_cols[field.attrs.name] = is_invisible;
        if (save)
          this.save_hide_cols();
    },
    load_list: function(data) {
        var self = this;

        this._super(data);

        var $menu = this.$pager.find('.oe_view_hide_cols_menu');
        if (!$menu.size()) {
          this.$pager.prepend(QWeb.render("ListView.hide_cols", this));
        }

        this.$pager.find('.oe_view_hide_cols_menu li input').click(function(){
            $checkbox = $(this);
            _.map(self.fields_view.arch.children, function(field){
                if (field.attrs.name == $checkbox.data('field')) {
                    self.add_invisible(field, !$checkbox.prop('checked'), true);
                }
            });
            self.load_list(self.fields_view);
            self.reload();
        });
    }
  });
};
