# -*- coding: utf-8 -*-
import openerp
from openerp.addons.web_diagram.controllers.main import DiagramView


class Controller(DiagramView):

    @openerp.http.route('/web_diagram/diagram/get_diagram_info', type='json', auth='user')
    def get_diagram_info(self, req, id, model, node, connector,
                         src_node, des_node, label, **kw):
        result = super(Controller, self).get_diagram_info(req, id, model, node, connector,
                                                          src_node, des_node, label, **kw)
        node_obj = req.env[node]
        for node_id, node_val in result['nodes'].items():
            node_rec = node_obj.browse(int(node_id))
            node_x = getattr(node_rec, 'x', None)
            if node_x:
                node_val['x'] = node_x
            node_y = getattr(node_rec, 'y', None)
            if node_x:
                node_val['y'] = node_y

        return result
