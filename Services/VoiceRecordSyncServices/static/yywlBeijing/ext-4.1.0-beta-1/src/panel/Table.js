/**
 * @author Nicolas Ferrero
 *
 * TablePanel is the basis of both {@link Ext.tree.Panel TreePanel} and {@link Ext.grid.Panel GridPanel}.
 *
 * TablePanel aggregates:
 *
 *  - a Selection Model
 *  - a View
 *  - a Store
 *  - Scrollers
 *  - Ext.grid.header.Container
 */
Ext.define('Ext.panel.Table', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.tablepanel',

    uses: [
        'Ext.selection.RowModel',
        'Ext.grid.PagingScroller',
        'Ext.grid.header.Container',
        'Ext.grid.Lockable'
    ],

    extraBaseCls: Ext.baseCSSPrefix + 'grid',
    extraBodyCls: Ext.baseCSSPrefix + 'grid-body',

    layout: 'fit',
    /**
     * @property {Boolean} hasView
     * True to indicate that a view has been injected into the panel.
     */
    hasView: false,

    // each panel should dictate what viewType and selType to use
    /**
     * @cfg {String} viewType
     * An xtype of view to use. This is automatically set to 'gridview' by {@link Ext.grid.Panel Grid}
     * and to 'treeview' by {@link Ext.tree.Panel Tree}.
     */
    viewType: null,

    /**
     * @cfg {Object} viewConfig
     * A config object that will be applied to the grid's UI view. Any of the config options available for
     * {@link Ext.view.Table} can be specified here. This option is ignored if {@link #view} is specified.
     */

    /**
     * @cfg {Ext.view.Table} view
     * The {@link Ext.view.Table} used by the grid. Use {@link #viewConfig} to just supply some config options to
     * view (instead of creating an entire View instance).
     */

    /**
     * @cfg {String} selType
     * An xtype of selection model to use. Defaults to 'rowmodel'. This is used to create selection model if just
     * a config object or nothing at all given in {@link #selModel} config.
     */
    selType: 'rowmodel',

    /**
     * @cfg {Ext.selection.Model/Object} selModel
     * A {@link Ext.selection.Model selection model} instance or config object.  In latter case the {@link #selType}
     * config option determines to which type of selection model this config is applied.
     */

    /**
     * @cfg {Boolean} multiSelect
     * True to enable 'MULTI' selection mode on selection model. See {@link Ext.selection.Model#mode}.
     */

    /**
     * @cfg {Boolean} simpleSelect
     * True to enable 'SIMPLE' selection mode on selection model. See {@link Ext.selection.Model#mode}.
     */

    /**
     * @cfg {Ext.data.Store} store (required)
     * The {@link Ext.data.Store Store} the grid should use as its data source.
     */

    /**
     * @cfg {String/Boolean} scroll
     * Scrollers configuration. Valid values are 'both', 'horizontal' or 'vertical'.
     * True implies 'both'. False implies 'none'.
     */
    scroll: true,

    /**
     * @cfg {Ext.grid.column.Column[]} columns
     * An array of {@link Ext.grid.column.Column column} definition objects which define all columns that appear in this
     * grid. Each column definition provides the header text for the column, and a definition of where the data for that
     * column comes from.
     *
     * This can also be a configuration object for a {Ext.grid.header.Container HeaderContainer} which may override
     * certain default configurations if necessary. For example, the special layout may be overridden to use a simpler layout.
     */

    /**
     * @cfg {Boolean} forceFit
     * Ttrue to force the columns to fit into the available width. Headers are first sized according to configuration,
     * whether that be a specific width, or flex. Then they are all proportionally changed in width so that the entire
     * content width is used.
     */

    /**
     * @cfg {Ext.grid.feature.Feature[]} features
     * An array of grid Features to be added to this grid. See {@link Ext.grid.feature.Feature} for usage.
     */

    /**
     * @cfg {Boolean} [hideHeaders=false]
     * True to hide column headers.
     */

    /**
     * @cfg {Boolean} deferRowRender
     * Defaults to true to enable deferred row rendering.
     *
     * This allows the View to execute a refresh quickly, with the expensive update of the row structure deferred so
     * that layouts with GridPanels appear, and lay out more quickly.
     */

    deferRowRender: true,
     
    /**
     * @cfg {Boolean} sortableColumns
     * False to disable column sorting via clicking the header and via the Sorting menu items.
     */
    sortableColumns: true,

    /**
     * @cfg {Boolean} [enableLocking=false]
     * True to enable locking support for this grid. Alternatively, locking will also be automatically
     * enabled if any of the columns in the column configuration contain the locked config option.
     */
    enableLocking: false,

    // private property used to determine where to go down to find views
    // this is here to support locking.
    scrollerOwner: true,

    /**
     * @cfg {Boolean} [enableColumnMove=true]
     * False to disable column dragging within this grid.
     */
    enableColumnMove: true,
    
    /**
     * @cfg {Boolean} [restrictColumnReorder=false]
     * True to constrain column dragging so that a column cannot be dragged in or out of it's
     * current group. Only relevant while {@link #enableColumnMove} is enabled.
     */
    restrictColumnReorder: false,

    /**
     * @cfg {Boolean} [enableColumnResize=true]
     * False to disable column resizing within this grid.
     */
    enableColumnResize: true,

    /**
     * @cfg {Boolean} [enableColumnHide=true]
     * False to disable column hiding within this grid.
     */
    enableColumnHide: true,

    /**
     * @cfg {Boolean} columnLines Adds column line styling
     */

    /**
     * @cfg {Boolean} [rowLines=true] Adds row line styling
     */
    rowLines: true,

    /**
     * @cfg {Boolean} [disableSelection=false]
     * True to disable selection model.
     */

    initComponent: function() {
        //<debug>
        if (!this.viewType) {
            Ext.Error.raise("You must specify a viewType config.");
        }
        if (this.headers) {
            Ext.Error.raise("The headers config is not supported. Please specify columns instead.");
        }
        //</debug>

        var me          = this,
            scroll      = me.scroll,
            vertical    = false,
            horizontal  = false,
            headerCtCfg = me.columns || me.colModel,
            view,
            border = me.border;

        if (me.hideHeaders) {
            border = false;
        }

        if (me.columnLines) {
            me.addCls(Ext.baseCSSPrefix + 'grid-with-col-lines');
        }

        if (me.rowLines) {
            me.addCls(Ext.baseCSSPrefix + 'grid-with-row-lines');
        }
        
        // Look up the configured Store. If none configured, use the fieldless, empty Store defined in Ext.data.Store.
        me.store = Ext.data.StoreManager.lookup(me.store || 'ext-empty-store');

        // The columns/colModel config may be either a fully instantiated HeaderContainer, or an array of Column definitions, or a config object of a HeaderContainer
        // Either way, we extract a columns property referencing an array of Column definitions.
        if (headerCtCfg instanceof Ext.grid.header.Container) {
            me.headerCt = headerCtCfg;
            me.headerCt.border = border;
            me.columns = me.headerCt.items.items;
        } else {
            if (Ext.isArray(headerCtCfg)) {
                headerCtCfg = {
                    items: headerCtCfg,
                    border: border
                };
            }
            Ext.apply(headerCtCfg, {
                forceFit: me.forceFit,
                sortable: me.sortableColumns,
                enableColumnMove: me.enableColumnMove,
                enableColumnResize: me.enableColumnResize,
                enableColumnHide: me.enableColumnHide,
                border:  border,
                restrictReorder: me.restrictColumnReorder
            });
            me.columns = headerCtCfg.items;

             // If any of the Column objects contain a locked property, and are not processed, this is a lockable TablePanel, a
             // special view will be injected by the Ext.grid.Lockable mixin, so no processing of .
             if (me.enableLocking || Ext.ComponentQuery.query('{locked !== undefined}{processed != true}', me.columns).length) {
                 me.self.mixin('lockable', Ext.grid.Lockable);
                 me.injectLockable();
             }
        }

        me.addEvents(
            /**
             * @event reconfigure
             * Fires after a reconfigure.
             * @param {Ext.panel.Table} this
             * @param {Ext.data.Store} store The store that was passed to the {@link #method-reconfigure} method
             * @param {Object[]} columns The column configs that were passed to the {@link #method-reconfigure} method
             */
            'reconfigure',
            /**
             * @event viewready
             * Fires when the grid view is available (use this for selecting a default row).
             * @param {Ext.panel.Table} this
             */
            'viewready'
        );

        me.bodyCls = me.bodyCls || '';
        me.bodyCls += (' ' + me.extraBodyCls);
        
        me.cls = me.cls || '';
        me.cls += (' ' + me.extraBaseCls);

        // autoScroll is not a valid configuration
        delete me.autoScroll;

        // If this TablePanel is lockable (Either configured lockable, or any of the defined columns has a 'locked' property)
        // than a special lockable view containing 2 side-by-side grids will have been injected so we do not need to set up any UI.
        if (!me.hasView) {

            // If we were not configured with a ready-made headerCt (either by direct config with a headerCt property, or by passing
            // a HeaderContainer instance as the 'columns' property, then go ahead and create one from the config object created above.
            if (!me.headerCt) {
                me.headerCt = new Ext.grid.header.Container(headerCtCfg);
            }

            // Extract the array of Column objects
            me.columns = me.headerCt.items.items;

            // If the Store is paging blocks of the dataset in, then it can only be sorted remotely.
            if (me.store.buffered && !me.store.remoteSort) {
                for (var i = 0, len = me.columns.length; i < len; i++) {
                    me.columns[i].sortable = false;
                }
            }

            if (me.hideHeaders) {
                me.headerCt.height = 0;
                me.headerCt.border = false;
                me.headerCt.addCls(Ext.baseCSSPrefix + 'grid-header-ct-hidden');
                me.addCls(Ext.baseCSSPrefix + 'grid-header-hidden');
                // IE Quirks Mode fix
                // If hidden configuration option was used, several layout calculations will be bypassed.
                if (Ext.isIEQuirks) {
                    me.headerCt.style = {
                        display: 'none'
                    };
                }
            }

            // turn both on.
            if (scroll === true || scroll === 'both') {
                vertical = horizontal = true;
            } else if (scroll === 'horizontal') {
                horizontal = true;
            } else if (scroll === 'vertical') {
                vertical = true;
            }

            me.relayHeaderCtEvents(me.headerCt);
            me.features = me.features || [];
            if (!Ext.isArray(me.features)) {
                me.features = [me.features];
            }
            me.dockedItems = me.dockedItems || [];
            me.dockedItems.unshift(me.headerCt);
            me.viewConfig = me.viewConfig || {};

            // Buffered scrolling must preserve scroll on refresh
            if (me.store && me.store.buffered) {
                me.viewConfig.preserveScrollOnRefresh = true;
            } else if (me.invalidateScrollerOnRefresh !== undefined) {
                me.viewConfig.preserveScrollOnRefresh = !me.invalidateScrollerOnRefresh;
            }

            // AbstractDataView will look up a Store configured as an object
            // getView converts viewConfig into a View instance
            view = me.getView();

            me.items = [view];
            me.hasView = true;

            if (vertical) {
                // If the Store is buffered, create a PagingScroller to monitor the View's scroll progress,
                // load the Store's prefetch buffer when it detects we are nearing an edge.
                if (me.store.buffered) {
                    me.verticalScroller = new Ext.grid.PagingScroller(Ext.apply({
                        panel: me,
                        store: me.store,
                        view: me.view
                    }, me.verticalScroller));
                }
            }

            if (horizontal) {
                // Add a listener to synchronize the horizontal scroll position of the headers
                // with the table view's element... Unless we are not showing headers!
                if (!me.hideHeaders) {
                    view.on({
                        scroll: {
                            fn: me.onHorizontalScroll,
                            element: 'el',
                            scope: me
                        }
                    });
                }
            }

            me.mon(view.store, {
                load: me.onStoreLoad,
                scope: me
            });
            me.mon(view, {
                viewready: me.onViewReady,
                refresh: me.onViewRefresh,
                scope: me
            });
        }

        // Relay events from the View whether it be a LockingView, or a regular GridView
        this.relayEvents(me.view, [
            /**
             * @event beforeitemmousedown
             * @inheritdoc Ext.view.View#beforeitemmousedown
             */
            'beforeitemmousedown',
            /**
             * @event beforeitemmouseup
             * @inheritdoc Ext.view.View#beforeitemmouseup
             */
            'beforeitemmouseup',
            /**
             * @event beforeitemmouseenter
             * @inheritdoc Ext.view.View#beforeitemmouseenter
             */
            'beforeitemmouseenter',
            /**
             * @event beforeitemmouseleave
             * @inheritdoc Ext.view.View#beforeitemmouseleave
             */
            'beforeitemmouseleave',
            /**
             * @event beforeitemclick
             * @inheritdoc Ext.view.View#beforeitemclick
             */
            'beforeitemclick',
            /**
             * @event beforeitemdblclick
             * @inheritdoc Ext.view.View#beforeitemdblclick
             */
            'beforeitemdblclick',
            /**
             * @event beforeitemcontextmenu
             * @inheritdoc Ext.view.View#beforeitemcontextmenu
             */
            'beforeitemcontextmenu',
            /**
             * @event itemmousedown
             * @inheritdoc Ext.view.View#itemmousedown
             */
            'itemmousedown',
            /**
             * @event itemmouseup
             * @inheritdoc Ext.view.View#itemmouseup
             */
            'itemmouseup',
            /**
             * @event itemmouseenter
             * @inheritdoc Ext.view.View#itemmouseenter
             */
            'itemmouseenter',
            /**
             * @event itemmouseleave
             * @inheritdoc Ext.view.View#itemmouseleave
             */
            'itemmouseleave',
            /**
             * @event itemclick
             * @inheritdoc Ext.view.View#itemclick
             */
            'itemclick',
            /**
             * @event itemdblclick
             * @inheritdoc Ext.view.View#itemdblclick
             */
            'itemdblclick',
            /**
             * @event itemcontextmenu
             * @inheritdoc Ext.view.View#itemcontextmenu
             */
            'itemcontextmenu',
            /**
             * @event beforecontainermousedown
             * @inheritdoc Ext.view.View#beforecontainermousedown
             */
            'beforecontainermousedown',
            /**
             * @event beforecontainermouseup
             * @inheritdoc Ext.view.View#beforecontainermouseup
             */
            'beforecontainermouseup',
            /**
             * @event beforecontainermouseover
             * @inheritdoc Ext.view.View#beforecontainermouseover
             */
            'beforecontainermouseover',
            /**
             * @event beforecontainermouseout
             * @inheritdoc Ext.view.View#beforecontainermouseout
             */
            'beforecontainermouseout',
            /**
             * @event beforecontainerclick
             * @inheritdoc Ext.view.View#beforecontainerclick
             */
            'beforecontainerclick',
            /**
             * @event beforecontainerdblclick
             * @inheritdoc Ext.view.View#beforecontainerdblclick
             */
            'beforecontainerdblclick',
            /**
             * @event beforecontainercontextmenu
             * @inheritdoc Ext.view.View#beforecontainercontextmenu
             */
            'beforecontainercontextmenu',
            /**
             * @event containermouseup
             * @inheritdoc Ext.view.View#containermouseup
             */
            'containermouseup',
            /**
             * @event containermouseover
             * @inheritdoc Ext.view.View#containermouseover
             */
            'containermouseover',
            /**
             * @event containermouseout
             * @inheritdoc Ext.view.View#containermouseout
             */
            'containermouseout',
            /**
             * @event containerclick
             * @inheritdoc Ext.view.View#containerclick
             */
            'containerclick',
            /**
             * @event containerdblclick
             * @inheritdoc Ext.view.View#containerdblclick
             */
            'containerdblclick',
            /**
             * @event containercontextmenu
             * @inheritdoc Ext.view.View#containercontextmenu
             */
            'containercontextmenu',
            /**
             * @event selectionchange
             * @inheritdoc Ext.selection.Model#selectionchange
             */
            'selectionchange',
            /**
             * @event beforeselect
             * @inheritdoc Ext.selection.RowModel#beforeselect
             */
            'beforeselect',
            /**
             * @event select
             * @inheritdoc Ext.selection.RowModel#select
             */
            'select',
            /**
             * @event beforedeselect
             * @inheritdoc Ext.selection.RowModel#beforedeselect
             */
            'beforedeselect',
            /**
             * @event deselect
             * @inheritdoc Ext.selection.RowModel#deselect
             */
            'deselect'
        ]);

        me.callParent(arguments);
    },

    // state management
    initStateEvents: function(){
        this.stateEvents = Ext.Array.merge(this.stateEvents, ['columnresize', 'columnmove', 'columnhide', 'columnshow', 'sortchange']);
        this.callParent();
    },

    relayHeaderCtEvents: function (headerCt) {
        this.relayEvents(headerCt, [
            /**
             * @event columnresize
             * @inheritdoc Ext.grid.header.Container#columnresize
             */
            'columnresize',
            /**
             * @event columnmove
             * @inheritdoc Ext.grid.header.Container#columnmove
             */
            'columnmove',
            /**
             * @event columnhide
             * @inheritdoc Ext.grid.header.Container#columnhide
             */
            'columnhide',
            /**
             * @event columnshow
             * @inheritdoc Ext.grid.header.Container#columnshow
             */
            'columnshow',
            /**
             * @event sortchange
             * @inheritdoc Ext.grid.header.Container#sortchange
             */
            'sortchange'
        ]);
    },

    getState: function(){
        var me = this,
            state = me.callParent(),
            sorter = me.store.sorters.first();

        state = me.addPropertyToState(state, 'columns', (me.headerCt || me).getColumnsState());

        if (sorter) {
            state = me.addPropertyToState(state, 'sort', {
                property: sorter.property,
                direction: sorter.direction,
                root: sorter.root
            });
        }
        return state;
    },

    applyState: function(state) {
        var me = this,
            sorter = state.sort,
            store = me.store,
            columns = state.columns;

        delete state.columns;

        // Ensure superclass has applied *its* state.
        // AbstractComponent saves dimensions (and anchor/flex) plus collapsed state.
        me.callParent(arguments);

        if (columns) {
            (me.headerCt || me).applyColumnsState(columns);
        }

        if (sorter) {
            if (store.remoteSort) {
                // Pass false to prevent a sort from occurring
                store.sort({
                    property: sorter.property,
                    direction: sorter.direction,
                    root: sorter.root
                }, null, false);
            } else {
                store.sort(sorter.property, sorter.direction);
            }
        }
    },

    /**
     * Returns the store associated with this Panel.
     * @return {Ext.data.Store} The store
     */
    getStore: function(){
        return this.store;
    },

    /**
     * Gets the view for this panel.
     * @return {Ext.view.Table}
     */
    getView: function() {
        var me = this,
            sm;

        if (!me.view) {
            sm = me.getSelectionModel();
            me.view = Ext.widget(Ext.apply({}, me.viewConfig, {
                deferInitialRefresh: me.deferRowRender !== false,
                scroll: me.scroll,
                xtype: me.viewType,
                store: me.store,
                headerCt: me.headerCt,
                selModel: sm,
                features: me.features,
                panel: me
            }));
            me.mon(me.view, {
                uievent: me.processEvent,
                scope: me
            });
            sm.view = me.view;
            me.headerCt.view = me.view;
            me.relayEvents(me.view, ['cellclick', 'celldblclick']);
        }
        return me.view;
    },

    /**
     * @private
     * autoScroll is never valid for all classes which extend TablePanel.
     */
    setAutoScroll: Ext.emptyFn,

    /**
     * @private
     * Processes UI events from the view. Propagates them to whatever internal Components need to process them.
     * @param {String} type Event type, eg 'click'
     * @param {Ext.view.Table} view TableView Component
     * @param {HTMLElement} cell Cell HtmlElement the event took place within
     * @param {Number} recordIndex Index of the associated Store Model (-1 if none)
     * @param {Number} cellIndex Cell index within the row
     * @param {Ext.EventObject} e Original event
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        var me = this,
            header;

        if (cellIndex !== -1) {
            header = me.headerCt.getGridColumns()[cellIndex];
            return header.processEvent.apply(header, arguments);
        }
    },

    /**
     * This method is obsolete in 4.1. The closest equivalent in
     * 4.1 is {@link #doLayout}, but it is also possible that no
     * layout is needed.
     * @deprecated 4.1
     */
    determineScrollbars: function () {
        //<debug>
        Ext.log.warn('Obsolete');
        //</debug>
    },

    /**
     * This method is obsolete in 4.1. The closest equivalent in 4.1 is
     * {@link Ext.AbstractComponent#updateLayout}, but it is also possible that no layout
     * is needed.
     * @deprecated 4.1
     */
    invalidateScroller: function () {
        //<debug>
        Ext.log.warn('Obsolete');
        //</debug>
    },

    scrollByDeltaY: function(yDelta, animate) {
        this.getView().scrollBy(0, yDelta, animate);
    },

    scrollByDeltaX: function(xDelta, animate) {
        this.getView().scrollBy(xDelta, 0, animate);
    },

    afterCollapse: function() {
        var me = this;
        me.saveScrollPos();
        me.saveScrollPos();
        me.callParent(arguments);
    },

    afterExpand: function() {
        var me = this;
        me.callParent(arguments);
        me.restoreScrollPos();
        me.restoreScrollPos();
    },

    saveScrollPos: Ext.emptyFn,

    restoreScrollPos: Ext.emptyFn,

    // refresh the view when a header moves
    onHeaderMove: function(headerCt, header, colsToMove, fromIdx, toIdx) {
        this.view.moveColumn(fromIdx, toIdx, colsToMove);
    },

    // Section onHeaderHide is invoked after view.
    onHeaderHide: function(headerCt, header) {
    },

    onHeaderShow: function(headerCt, header) {
    },

/**
     * @private
     * Fires the TablePanel's viewready event when the view declares that its internal DOM is ready
     */
    onViewReady: function() {
         this.fireEvent('viewready', this);   
    },

    /**
     * @private
     * Tracks when the first data arrives in the grid, and if it needs to be initially refitted to fit within the Panel's scrollWidth, updates
     * the header container's layhout.
     */
    onViewRefresh: function() {

        // First "real", (that is with data) refresh of View should relay the header container if there is any flexing, or grouping.
        if (this.store.getCount() && !this.firstDataArrived && this.headerCt.down('gridcolumn[flex]') || this.headerCt.down('gridcolumn[isGroupHeader]')) {
            this.firstDataArrived = true;
            this.headerCt.updateLayout();
        }
    },

    /**
     * Sets the scrollTop of the TablePanel.
     * @param {Number} top
     */
    setScrollTop: function(top) {
        var me               = this,
            rootCmp          = me.getScrollerOwner();

        rootCmp.virtualScrollTop = top;
    },

    getScrollerOwner: function() {
        var rootCmp = this;
        if (!this.scrollerOwner) {
            rootCmp = this.up('[scrollerOwner]');
        }
        return rootCmp;
    },

    /**
     * Gets left hand side marker for header resizing.
     * @private
     */
    getLhsMarker: function() {
        var me = this;
        return me.lhsMarker || (me.lhsMarker = Ext.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true));
    },

    /**
     * Gets right hand side marker for header resizing.
     * @private
     */
    getRhsMarker: function() {
        var me = this;

        return me.rhsMarker || (me.rhsMarker = Ext.DomHelper.append(me.el, {
                cls: Ext.baseCSSPrefix + 'grid-resize-marker'
            }, true));
    },

    /**
     * Returns the selection model being used and creates it via the configuration if it has not been created already.
     * @return {Ext.selection.Model} selModel
     */
    getSelectionModel: function(){
        if (!this.selModel) {
            this.selModel = {};
        }

        var mode = 'SINGLE',
            type;
        if (this.simpleSelect) {
            mode = 'SIMPLE';
        } else if (this.multiSelect) {
            mode = 'MULTI';
        }

        Ext.applyIf(this.selModel, {
            allowDeselect: this.allowDeselect,
            mode: mode
        });

        if (!this.selModel.events) {
            type = this.selModel.selType || this.selType;
            this.selModel = Ext.create('selection.' + type, this.selModel);
        }

        if (!this.selModel.hasRelaySetup) {
            this.relayEvents(this.selModel, [
                'selectionchange', 'beforeselect', 'beforedeselect', 'select', 'deselect'
            ]);
            this.selModel.hasRelaySetup = true;
        }

        // lock the selection model if user
        // has disabled selection
        if (this.disableSelection) {
            this.selModel.locked = true;
        }
        return this.selModel;
    },

    onHorizontalScroll: function(event, target) {
        var owner = this.getScrollerOwner(),
            items = owner.query('tableview'),
            center = items[1] || items[0];

        center.el.dom.scrollLeft = target.scrollLeft;
        this.headerCt.el.dom.scrollLeft = target.scrollLeft;
    },

    // template method meant to be overriden
    onStoreLoad: Ext.emptyFn,

    getEditorParent: function() {
        return this.body;
    },

    bindStore: function(store) {
        var me = this;
        me.store = store;
        me.getView().bindStore(store);
    },
    
    beforeDestroy: function(){
        Ext.destroy(this.verticalScroller);
        this.callParent();    
    },

    /**
     * Reconfigures the table with a new store/columns. Either the store or the columns can be ommitted if you don't wish
     * to change them.
     * @param {Ext.data.Store} store (Optional) The new store.
     * @param {Object[]} columns (Optional) An array of column configs
     */
    reconfigure: function(store, columns) {
        var me = this,
            headerCt = me.headerCt;

        if (me.lockable) {
            me.reconfigureLockable(store, columns);
        } else {
            if (columns) {
                headerCt.suspendLayouts();
                headerCt.removeAll();
                headerCt.add(columns);
            }
            if (store) {
                store = Ext.StoreManager.lookup(store);
                me.bindStore(store);
            } else {
                me.getView().refresh();
            }
            if (columns) {
                headerCt.resumeLayouts(true);
            }
            headerCt.setSortState();
        }
        me.fireEvent('reconfigure', me, store, columns);
    }
});
