var attentionCombo = Ext.create('Ext.data.Store', {

	fields: ['name', 'value'],

	proxy: {
		type: 'ajax',
		url: 'http://localhost:8080'
	}
});

var attentionGrid = Ext.create('Ext.data.Store', {
	model: 'AttentionGridModel',

	proxy: {
		type: 'ajax',
		url: 'http://localhost:8080/grid'
	}
});

attentionCombo.load();

attentionGrid.load();