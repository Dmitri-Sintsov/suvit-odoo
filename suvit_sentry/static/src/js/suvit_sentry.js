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
      instance.session.session_reload().then(function() {
        console.log(this.session);
        Raven.setUserContext({
          name: this.session.username,
          context: this.session.user_context,
          id: this.session.uid
        });
      }.bind(this));
      new instance.web.Model("ir.config_parameter").call("get_param", ['SENTRY_CLIENT_JS_DSN']).then(function(value) {
        if (value) {
          Raven.config(value).install();
        }
      });
    }
  });
  instance.web.CrashManager.include({
    show_error: function(error) {
      if (typeof error.client !== 'undefined') {
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
      // Do not set window.onerror = function() {} because there could be multiple event listeners.
      window.addEventListener('error', function (evt) {
          self.crashmanager.show_error({
              type: _t("Client Error"),
              message: evt.message,
              data: {debug: evt.lineno + ':' + evt.filename},
              // file + ':' + line
              client: true
          });
      });
    }
  });
};