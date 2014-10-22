Ext.onReady(function() {

	Ext.create("Ext.panel.Panel", {
		bodyPadding: 5,

		margin: '10 0 0 0',

		border: 0,

		// height: 130,

		renderTo: 'searchPanel',

		layout: 'hbox',

		defaults: {
			border: 0
		},

		items: [{
			xtype: 'button',
			text: '新建',
			margin: '0 15 0 10'
		}, {
			xtype: 'button',
			text: '删除',
			margin: '0 15 0 0'
		}, {
			xtype: 'form',
			layout: 'hbox',
			// height: 130,
			defaults: {
				xtype: 'textfield',
				labelAlign: 'right'
			},

			items: [{
				fieldLabel: '名称',
				name: 'name',
				labelWidth: 40
			}, {
				fieldLabel: '案件',
				name: 'case',
				xtype: 'combo',
				store: attentionCombo,
				displayField: 'name',
				valueField: 'value',
				labelWidth: 40,
				emptyText: '请选择'
			}]
		}, {
			xtype: 'button',
			text: '查询',
			margin: '0 0 0 15'
		}, {
			xtype: 'button',
			text: '自动测试',
			margin: '0 0 0 15'
		}, {
			xtype: 'displayfield',
			value: '上次刷新时间:',
			margin: '0 0 0 15'
		}, {
			xtype: 'displayfield',
			name: 'showtime',
			value: '',
			margin: '0 0 0 15'
		}]
	});

	Ext.create('Ext.grid.Panel', {
		renderTo: 'gridPanel',
		store: attentionGrid,
		margin: '20 0 0 0',
		columns: [{
			text: '名称',
			sortable: true,
			hideable: true,
			dataIndex: 'taskname',
			width: 250
		}, {
			text: '案件',
			sortable: true,
			hideable: true,
			dataIndex: 'catalogname',
			width: 250
		}, {
			text: '监控起始时间',
			sortable: true,
			hideable: true,
			dataIndex: 'attstarttime',
			width: 250
		}, {
			text: '监控结束时间',
			sortable: true,
			hideable: true,
			dataIndex: 'attendtime',
			width: 250
		}, {
			text: '监控状态',
			sortable: true,
			hideable: true,
			dataIndex: 'status',
			width: 250
		}, {
			text: '今日新增可疑通话',
			sortable: true,
			hideable: true,
			dataIndex: 'newtodaynum',
			width: 250
		}, {
			text: '未听可疑通话',
			sortable: true,
			hideable: true,
			dataIndex: 'havenotlistennum',
			width: 250
		}, {
			text: '可疑通话总数',
			sortable: true,
			hideable: true,
			dataIndex: 'totalnum',
			flex: 1
		}]
	})
});