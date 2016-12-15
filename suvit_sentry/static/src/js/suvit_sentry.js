openerp.suvit_sentry = function(instance, local) {
  $('.oe_error_detail .show_details').live('click', function() {
    $('.oe_error_detail .hide_details').show();
    $('.oe_error_detail .error_details').show();
    $(this).hide();
  });
  $('.oe_error_detail .hide_details').live('click', function() {
    $('.oe_error_detail .show_details').show();
    $('.oe_error_detail .error_details').hide();
    $(this).hide();
  });

  var _t = instance.web._t;
  instance.web.Client.include({
    init: function(parent, origin) {
      this._super(parent, origin);
      var _instance = instance;
      new instance.web.Model("ir.config_parameter").call("get_param", ['SENTRY_CLIENT_JS_DSN']).then(function(value) {
        if (value) {
          Raven.config(value, {
            dataCallback: function(data) {
              if (typeof _instance.session.username !== 'undefined') {
                // Add user information only when it's available right before reporting the error.
                data = _.extend(data, {
                  user: {
                    name: _instance.session.username,
                    context: _instance.session.user_context,
                    id: _instance.session.uid
                  }
                });
              }
              return data;
            }
          }).install();
        }
      });
    }
  });
  instance.web.CrashManager.include({
    show_error: function(error) {
      if (error.client) {
        try {
          Raven.captureException(error.message, {extra: error});
          error.last_code = Raven.lastEventId();
        } catch (e) {}
      }
      if (error.message.indexOf('XmlHttpRequestError') === 0) {
        error.lost_network = true;
        error.message = 'Связь с сервером потеряна, попробуйте зайти позже';
      }
      return this._super(error);
    },
  });
  instance.web.WebClient.include({
    show_common: function() {
      var self = this;
      this._super();
      window.onerror = function (message, file, line) {
          self.crashmanager.show_error({
              type: _t("Client Error"),
              message: message,
              data: {debug: file + ':' + line},
              client: true
          });
      };
    }
  });
};