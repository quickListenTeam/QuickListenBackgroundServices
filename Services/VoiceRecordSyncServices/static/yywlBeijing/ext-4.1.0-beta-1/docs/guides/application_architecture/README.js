Ext.data.JsonP.application_architecture({"title":"MVC Application Architecture","guide":"<h1>MVC Architecture</h1>\n\n<p>Large client side applications have always been hard to write, hard to organize and hard to maintain. They tend to quickly grow out of control as you add more functionality and developers to a project. Ext JS 4 comes with a new application architecture that not only organizes your code but reduces the amount you have to write.</p>\n\n<p>Our application architecture follows an MVC-like pattern with Models and Controllers being introduced for the first time. There are many MVC architectures, most of which are slightly different from one another. Here's how we define ours:</p>\n\n<ul>\n<li><p><em>Model</em> is a collection of fields and their data (e.g. a User model with username and password fields). Models know how to persist themselves through the data package, and can be linked to other models through associations. Models work a lot like the Ext JS 3 Record class, and are normally used with <a href=\"#/api/Ext.data.Store\">Stores</a> to present data into grids and other components</p></li>\n<li><p><em>View</em> is any type of component - grids, trees and panels are all views.</p></li>\n<li><p><em>Controllers</em> are special places to put all of the code that makes your app work - whether that's rendering views, instantiating Models, or any other app logic.</p></li>\n</ul>\n\n\n<p>In this guide we'll be creating a very simple application that manages User data. By the end you will know how to put simple applications together using the new Ext JS 4 application architecture.</p>\n\n<p>The application architecture is as much about providing structure and consistency as it is about actual classes and framework code. Following the conventions unlocks a number of important benefits:</p>\n\n<ul>\n<li>Every application works the same way so you only have to learn it once</li>\n<li>It's easy to share code between apps because they all work the same way</li>\n<li>You can use our build tools to create optimized versions of your applications for production use</li>\n</ul>\n\n\n<h2>File Structure</h2>\n\n<p>Ext JS 4 applications follow a unified directory structure that is the same for every app. Please check out the <a href=\"#/guide/getting_started\">Getting Started guide</a> for a detailed explanation on the basic file structure of an application. In MVC layout, all classes are placed into the <code>app</code> folder, which in turn contains sub-folders to namespace your models, views, controllers and stores. Here is how the folder structure for the simple example app will look when we're done:</p>\n\n<p><p><img src=\"guides/application_architecture/folderStructure.png\" alt=\"Folder Structure\"></p></p>\n\n<p>In this example, we are encapsulating the whole application inside one folder called '<code>account_manager</code>'. Essential files from the <a href=\"http://www.sencha.com/products/extjs/\">Ext JS 4 SDK</a> are wrapped inside <code>ext-4.0</code> folder. Hence the content of our <code>index.html</code> looks like this:</p>\n\n<pre><code>&lt;html&gt;\n&lt;head&gt;\n    &lt;title&gt;Account Manager&lt;/title&gt;\n\n    &lt;link rel=\"stylesheet\" type=\"text/css\" href=\"ext-4.0/resources/css/ext-all.css\"&gt;\n\n    &lt;script type=\"text/javascript\" src=\"ext-4.0/ext-debug.js\"&gt;&lt;/script&gt;\n\n    &lt;script type=\"text/javascript\" src=\"app.js\"&gt;&lt;/script&gt;\n&lt;/head&gt;\n&lt;body&gt;&lt;/body&gt;\n&lt;/html&gt;\n</code></pre>\n\n<h2>Creating the application in <code>app.js</code></h2>\n\n<p>Every Ext JS 4 application starts with an instance of <a href=\"#/api/Ext.app.Application\">Application</a> class. The Application contains global settings for your application (such as the app's name), as well as maintains references to all of the models, views and controllers used by the app. An Application also contains a launch function, which is run automatically when everything is loaded.B</p>\n\n<p>Let's create a simple Account Manager app that will help us manage User accounts. First we need to pick a global namespace for this application. All Ext JS 4 applications should only use a single global variable, with all of the application's classes nested inside it. Usually we want a short global variable so in this case we're going to use \"AM\":</p>\n\n<pre><code><a href=\"#!/api/Ext-method-application\" rel=\"Ext-method-application\" class=\"docClass\">Ext.application</a>({\n    name: 'AM',\n\n    appFolder: 'app',\n\n    launch: function() {\n        <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.container.Viewport\" rel=\"Ext.container.Viewport\" class=\"docClass\">Ext.container.Viewport</a>', {\n            layout: 'fit',\n            items: [\n                {\n                    xtype: 'panel',\n                    title: 'Users',\n                    html : 'List of users will go here'\n                }\n            ]\n        });\n    }\n});\n</code></pre>\n\n<p>There are a few things going on here. First we invoked <code><a href=\"#!/api/Ext-method-application\" rel=\"Ext-method-application\" class=\"docClass\">Ext.application</a></code> to create a new instance of Application class, to which we passed the name \"<code>AM</code>\". This automatically sets up a global variable <code>AM</code> for us, and registers the namespace to <code><a href=\"#!/api/Ext.Loader\" rel=\"Ext.Loader\" class=\"docClass\">Ext.Loader</a></code>, with the corresponding path of '<code>app</code>' set via the <code>appFolder</code> config option. We also provided a simple launch function that just creates a <a href=\"#/api/Ext.container.Viewport\">Viewport</a> which contains a single <a href=\"#/api/Ext.panel.Panel\">Panel</a> that will fill the screen.</p>\n\n<p><p><img src=\"guides/application_architecture/panelView.png\" alt=\"Initial view with a simple Panel\"></p></p>\n\n<h2>Defining a Controller</h2>\n\n<p>Controllers are the glue that binds an application together. All they really do is listen for events (usually from views) and take some actions. Continuing our Account Manager application, lets create a controller.  Create a file called <code>app/controller/Users.js</code> and add the following code:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    init: function() {\n        console.log('Initialized Users! This happens before the Application launch function is called');\n    }\n});\n</code></pre>\n\n<p>Now lets add our newly created Users controller to the application config in app.js:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-application\" rel=\"Ext-method-application\" class=\"docClass\">Ext.application</a>({\n    ...\n\n    controllers: [\n        'Users'\n    ],\n\n    ...\n});\n</code></pre>\n\n<p>When we load our application by visiting <code>index.html</code> inside a browser, the <code>Users</code> controller is automatically loaded (because we specified it in the Application definition above), and its <code>init</code> function is called just before the Application's <code>launch</code> function.</p>\n\n<p>The <code>init</code> function is a great place to set up how your controller interacts with the view, and is usually used in conjunction with another Controller function - <a href=\"#/api/Ext.app.Controller-method-control\">control</a>. The <code>control</code> function makes it easy to listen to events on your view classes and take some action with a handler function. Let's update our <code>Users</code> controller to tell us when the panel is rendered:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    init: function() {\n        this.control({\n            'viewport &gt; panel': {\n                render: this.onPanelRendered\n            }\n        });\n    },\n\n    onPanelRendered: function() {\n        console.log('The panel was rendered');\n    }\n});\n</code></pre>\n\n<p>We've updated the <code>init</code> function to use <code>this.control</code> to set up listeners on views in our application. The <code>control</code> function uses the new ComponentQuery engine to quickly and easily get references to components on the page. If you are not familiar with ComponentQuery yet, be sure to check out the <a href=\"#/api/Ext.ComponentQuery\">ComponentQuery documentation</a> for a full explanation. In brief though, it allows us to pass a CSS-like selector that will find every matching component on the page.</p>\n\n<p>In our init function above we supplied <code>'viewport &gt; panel'</code>, which translates to \"find me every Panel that is a direct child of a Viewport\". We then supplied an object that maps event names (just <code>render</code> in this case) to handler functions. The overall effect is that whenever any component that matches our selector fires a <code>render</code> event, our <code>onPanelRendered</code> function is called.</p>\n\n<p>When we run our application now we see the following:</p>\n\n<p><p><img src=\"guides/application_architecture/firstControllerListener.png\" alt=\"Controller listener\"></p></p>\n\n<p>Not exactly the most exciting application ever, but it shows how easy it is to get started with organized code. Let's flesh the app out a little now by adding a grid.</p>\n\n<h2>Defining a View</h2>\n\n<p>Until now our application has only been a few lines long and only inhabits two files -  <code>app.js</code> and <code>app/controller/Users.js</code>. Now that we want to add a grid showing all of the users in our system, it's time to organize our logic a little better and start using views.</p>\n\n<p>A View is nothing more than a Component, usually defined as a subclass of an Ext JS component. We're going to create our Users grid now by creating a new file called <code>app/view/user/List.js</code> and putting the following into it:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.view.user.List' ,{\n    extend: '<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>',\n    alias : 'widget.userlist',\n\n    title : 'All Users',\n\n    initComponent: function() {\n        this.store = {\n            fields: ['name', 'email'],\n            data  : [\n                {name: 'Ed',    email: 'ed@sencha.com'},\n                {name: 'Tommy', email: 'tommy@sencha.com'}\n            ]\n        };\n\n        this.columns = [\n            {header: 'Name',  dataIndex: 'name',  flex: 1},\n            {header: 'Email', dataIndex: 'email', flex: 1}\n        ];\n\n        this.callParent(arguments);\n    }\n});\n</code></pre>\n\n<p>Our View class is nothing more than a normal class. In this case we happen to extend the Grid Component and set up an alias so that we can use it as an xtype (more on that in a moment). We also passed in the <a href=\"Ext.data.Store\">store</a> configuration and the <a href=\"#/api/Ext.grid.Panel-cfg-columns\">columns</a> that the grid should render.</p>\n\n<p>Next we need to add this view to our <code>Users</code> controller. Because we set an alias using the special <code>'widget.'</code> format, we can use 'userlist' as an xtype now, just like we had used <code>'panel'</code> previously.</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    views: [\n        'user.List'\n    ],\n\n    init: ...\n\n    onPanelRendered: ...\n});\n</code></pre>\n\n<p>And then render it inside the main viewport by modifying the launch method in <code>app.js</code> to:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-application\" rel=\"Ext-method-application\" class=\"docClass\">Ext.application</a>({\n    ...\n\n    launch: function() {\n        <a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('<a href=\"#!/api/Ext.container.Viewport\" rel=\"Ext.container.Viewport\" class=\"docClass\">Ext.container.Viewport</a>', {\n            layout: 'fit',\n            items: {\n                xtype: 'userlist'\n            }\n        });\n    }\n});\n</code></pre>\n\n<p>The only other thing to note here is that we specified <code>'user.List'</code> inside the views array. This tells the application to load that file automatically so that we can use it when we launch. The application uses Ext JS 4's new dynamic loading system to automatically pull this file from the server. Here's what we see when we refresh the page now:</p>\n\n<p><p><img src=\"guides/application_architecture/firstView.png\" alt=\"Our first View\"></p></p>\n\n<h2>Controlling the grid</h2>\n\n<p>Note that our <code>onPanelRendered</code> function is still being called. This is because our grid class still matches the <code>'viewport &gt; panel'</code> selector. The reason for this is that our class extends Grid, which in turn extends Panel.</p>\n\n<p>At the moment, the listeners we add to this selector will actually be called for every Panel or Panel subclass that is a direct child of the viewport, so let's tighten that up a bit using our new xtype. While we're at it, let's instead listen for double clicks on rows in the grid so that we can later edit that User:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    views: [\n        'user.List'\n    ],\n\n    init: function() {\n        this.control({\n            'userlist': {\n                itemdblclick: this.editUser\n            }\n        });\n    },\n\n    editUser: function(grid, record) {\n        console.log('Double clicked on ' + record.get('name'));\n    }\n});\n</code></pre>\n\n<p>Note that we changed the ComponentQuery selector (to simply <code>'userlist'</code>), the event name (to <code>'itemdblclick'</code>) and the handler function name (to <code>'editUser'</code>). For now we're just logging out the name of the User we double clicked:</p>\n\n<p><p><img src=\"guides/application_architecture/doubleClickHandler.png\" alt=\"Double click handler\"></p></p>\n\n<p>Logging to the console is all well and good but we really want to edit our Users. Let's do that now, starting with a new view in <code>app/view/user/Edit.js</code>:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.view.user.Edit', {\n    extend: '<a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.window.Window</a>',\n    alias : 'widget.useredit',\n\n    title : 'Edit User',\n    layout: 'fit',\n    autoShow: true,\n\n    initComponent: function() {\n        this.items = [\n            {\n                xtype: 'form',\n                items: [\n                    {\n                        xtype: 'textfield',\n                        name : 'name',\n                        fieldLabel: 'Name'\n                    },\n                    {\n                        xtype: 'textfield',\n                        name : 'email',\n                        fieldLabel: 'Email'\n                    }\n                ]\n            }\n        ];\n\n        this.buttons = [\n            {\n                text: 'Save',\n                action: 'save'\n            },\n            {\n                text: 'Cancel',\n                scope: this,\n                handler: this.close\n            }\n        ];\n\n        this.callParent(arguments);\n    }\n});\n</code></pre>\n\n<p>Again we're just defining a subclass of an existing component - this time <code><a href=\"#!/api/Ext.window.Window\" rel=\"Ext.window.Window\" class=\"docClass\">Ext.window.Window</a></code>. Once more we used <code>initComponent</code> to specify the complex objects <code>items</code> and <code>buttons</code>. We used a <code>'fit'</code> layout and a form as the single item, which contains fields to edit the name and the email address. Finally we created two buttons, one which just closes the window, and the other that will be used to save our changes.</p>\n\n<p>All we have to do now is add the view to the controller, render it and load the User into it:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n\n    views: [\n        'user.List',\n        'user.Edit'\n    ],\n\n    init: ...\n\n    editUser: function(grid, record) {\n        var view = <a href=\"#!/api/Ext-method-widget\" rel=\"Ext-method-widget\" class=\"docClass\">Ext.widget</a>('useredit');\n\n        view.down('form').loadRecord(record);\n    }\n});\n</code></pre>\n\n<p>First we created the view using the convenient method <code><a href=\"#!/api/Ext-method-widget\" rel=\"Ext-method-widget\" class=\"docClass\">Ext.widget</a></code>, which is equivalent to <code><a href=\"#!/api/Ext-method-create\" rel=\"Ext-method-create\" class=\"docClass\">Ext.create</a>('widget.useredit')</code>. Then we leveraged ComponentQuery once more to quickly get a reference to the edit window's form. Every component in Ext JS 4 has a <code>down</code> function, which accepts a ComponentQuery selector to quickly find any child component.</p>\n\n<p>Double clicking a row in our grid now yields something like this:</p>\n\n<p><p><img src=\"guides/application_architecture/loadedForm.png\" alt=\"Loading the form\"></p></p>\n\n<h2>Creating a Model and a Store</h2>\n\n<p>Now that we have our edit form it's almost time to start editing our users and saving those changes. Before we do that though, we should refactor our code a little.</p>\n\n<p>At the moment the <code>AM.view.user.List</code> component creates a Store inline. This works well but we'd like to be able to reference that Store elsewhere in the application so that we can update the data in it. We'll start by breaking the Store out into its own file - <code>app/store/Users.js</code>:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.store.Users', {\n    extend: '<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Ext.data.Store</a>',\n    fields: ['name', 'email'],\n    data: [\n        {name: 'Ed',    email: 'ed@sencha.com'},\n        {name: 'Tommy', email: 'tommy@sencha.com'}\n    ]\n});\n</code></pre>\n\n<p>Now we'll just make 2 small changes - first we'll ask our <code>Users</code> controller to include this Store when it loads:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n    stores: [\n        'Users'\n    ],\n    ...\n});\n</code></pre>\n\n<p>then we'll update <code>app/view/user/List.js</code> to simply reference the Store by id:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.view.user.List' ,{\n    extend: '<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>',\n    alias : 'widget.userlist',\n\n    //we no longer define the Users store in the `initComponent` method\n    store: 'Users',\n\n    ...\n});\n</code></pre>\n\n<p>By including the stores that our <code>Users</code> controller cares about in its definition they are automatically loaded onto the page and given a <a href=\"#/api/Ext.data.Store-cfg-storeId\">storeId</a>, which makes them really easy to reference in our views (by simply configuring <code>store: 'Users'</code> in this case).</p>\n\n<p>At the moment we've just defined our fields (<code>'name'</code> and <code>'email'</code>) inline on the store. This works well enough but in Ext JS 4 we have a powerful <code><a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a></code> class that we'd like to take advantage of when it comes to editing our Users. We'll finish this section by refactoring our Store to use a Model, which we'll put in <code>app/model/User.js</code>:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.model.User', {\n    extend: '<a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Ext.data.Model</a>',\n    fields: ['name', 'email']\n});\n</code></pre>\n\n<p>That's all we need to do to define our Model, now we'll just update our Store to reference the Model name instead of providing fields inline, and ask the <code>Users</code> controller to get a reference to the model too:</p>\n\n<pre><code>//the Users controller will make sure that the User model is included on the page and available to our app\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    extend: '<a href=\"#!/api/Ext.app.Controller\" rel=\"Ext.app.Controller\" class=\"docClass\">Ext.app.Controller</a>',\n    stores: ['Users'],\n    models: ['User'],\n    ...\n});\n\n// we now reference the Model instead of defining fields inline\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.store.Users', {\n    extend: '<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Ext.data.Store</a>',\n    model: 'AM.model.User',\n\n    data: [\n        {name: 'Ed',    email: 'ed@sencha.com'},\n        {name: 'Tommy', email: 'tommy@sencha.com'}\n    ]\n});\n</code></pre>\n\n<p>Our refactoring will make the next section easier but should not have affected the application's current behavior. If we reload the page now and double click on a row we see that the edit User window still appears as expected. Now it's time to finish the editing functionality:</p>\n\n<p><p><img src=\"guides/application_architecture/loadedForm.png\" alt=\"Loading the form\"></p></p>\n\n<h2>Saving data with the Model</h2>\n\n<p>Now that we have our users grid loading data and opening an edit window when we double click each row, we'd like to save the changes that the user makes. The Edit User window that the defined above contains a form (with fields for name and email), and a save button. First let's update our controller's init function to listen for clicks to that save button:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.controller.Users', {\n    init: function() {\n        this.control({\n            'viewport &gt; userlist': {\n                itemdblclick: this.editUser\n            },\n            'useredit button[action=save]': {\n                click: this.updateUser\n            }\n        });\n    },\n\n    updateUser: function(button) {\n        console.log('clicked the Save button');\n    }\n});\n</code></pre>\n\n<p>We added a second ComponentQuery selector to our <code>this.control</code> call - this time <code>'useredit button[action=save]'</code>. This works the same way as the first selector - it uses the <code>'useredit'</code> xtype that we defined above to focus in on our edit user window, and then looks for any buttons with the <code>'save'</code> action inside that window. When we defined our edit user window we passed <code>{action: 'save'}</code> to the save button, which gives us an easy way to target that button.</p>\n\n<p>We can satisfy ourselves that the <code>updateUser</code> function is called when we click the Save button:</p>\n\n<p><p><img src=\"guides/application_architecture/saveHandler.png\" alt=\"Seeing the save handler\"></p></p>\n\n<p>Now that we've seen our handler is correctly attached to the Save button's click event, let's fill in the real logic for the <code>updateUser</code> function. In this function we need to get the data out of the form, update our User with it and then save that back to the Users store we created above. Let's see how we might do that:</p>\n\n<pre><code>updateUser: function(button) {\n    var win    = button.up('window'),\n        form   = win.down('form'),\n        record = form.getRecord(),\n        values = form.getValues();\n\n    record.set(values);\n    win.close();\n}\n</code></pre>\n\n<p>Let's break down what's going on here. Our click event gave us a reference to the button that the user clicked on, but what we really want is access to the form that contains the data and the window itself. To get things working quickly we'll just use ComponentQuery again here, first using <code>button.up('window')</code> to get a reference to the Edit User window, then <code>win.down('form')</code> to get the form.</p>\n\n<p>After that we simply fetch the record that's currently loaded into the form and update it with whatever the user has typed into the form. Finally we close the window to bring attention back to the grid. Here's what we see when we run our app again, change the name field to <code>'Ed Spencer'</code> and click save:</p>\n\n<p><p><img src=\"guides/application_architecture/updatedGridRecord.png\" alt=\"The record in the grid has been updated\"></p></p>\n\n<h3>Saving to the server</h3>\n\n<p>Easy enough. Let's finish this up now by making it interact with our server side. At the moment we are hard coding the two User records into the Users Store, so let's start by reading those over AJAX instead:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" class=\"docClass\">Ext.define</a>('AM.store.Users', {\n    extend: '<a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Ext.data.Store</a>',\n    model: 'AM.model.User',\n    autoLoad: true,\n\n    proxy: {\n        type: 'ajax',\n        url: 'data/users.json',\n        reader: {\n            type: 'json',\n            root: 'users',\n            successProperty: 'success'\n        }\n    }\n});\n</code></pre>\n\n<p>Here we removed the <code>'data'</code> property and replaced it with a <a href=\"#/api/Ext.data.proxy.Proxy\">Proxy</a>. Proxies are the way to load and save data from a Store or a Model in Ext JS 4. There are proxies for AJAX, JSON-P and HTML5 localStorage among others. Here we've used a simple AJAX proxy, which we've told to load data from the url <code>'data/users.json'</code>.</p>\n\n<p>We also attached a <a href=\"#/api/Ext.data.reader.Reader\">reader</a> to the Proxy. The reader is responsible for decoding the server response into a format the Store can understand. This time we used a JSON reader, and specified the root and <code>successProperty</code> configurations (see the <a href=\"#/api/Ext.data.reader.Json\">Json Reader</a> docs for more on those configurations). Finally we'll create our <code>data/users.json</code> file and paste our previous data into it:</p>\n\n<pre><code>{\n    success: true,\n    users: [\n        {id: 1, name: 'Ed',    email: 'ed@sencha.com'},\n        {id: 2, name: 'Tommy', email: 'tommy@sencha.com'}\n    ]\n}\n</code></pre>\n\n<p>The only other change we made to the Store was to set <code>autoLoad</code> to <code>true</code>, which means the Store will ask its Proxy to load that data immediately. If we refresh the page now we'll see the same outcome as before, except that we're now no longer hard coding the data into our application.</p>\n\n<p>The last thing we want to do here is send our changes back to the server. For this example we're just using static JSON files on the server side so we won't see any database changes but we can at least verify that everything is plugged together correctly. First we'll make a small change to our new proxy to tell it to send updates back to a different url:</p>\n\n<pre><code>proxy: {\n    type: 'ajax',\n    api: {\n        read: 'data/users.json',\n        update: 'data/updateUsers.json'\n    },\n    reader: {\n        type: 'json',\n        root: 'users',\n        successProperty: 'success'\n    }\n}\n</code></pre>\n\n<p>We're still reading the data from <code>users.json</code>, but any updates will be sent to <code>updateUsers.json</code>. This is just so that we can return a dummy response so we know things are working. The <code>updateUsers.json</code> file just contains <code>{\"success\": true}</code>. The only other change we need to make is to tell our Store to synchronize itself after editing, which we do by adding one more line inside the updateUser function, which now looks like this:</p>\n\n<pre><code>updateUser: function(button) {\n    var win    = button.up('window'),\n        form   = win.down('form'),\n        record = form.getRecord(),\n        values = form.getValues();\n\n    record.set(values);\n    win.close();\n    this.getUsersStore().sync();\n}\n</code></pre>\n\n<p>Now we can run through our full example and make sure that everything works. We'll edit a row, hit the Save button and see that the request is correctly sent to <code>updateUser.json</code></p>\n\n<p><p><img src=\"guides/application_architecture/postUpdatesToServer.png\" alt=\"The record in the grid has been updated\"></p></p>\n\n<h2>Deployment</h2>\n\n<p>The newly introduced Sencha SDK Tools (<a href=\"http://www.sencha.com/products/extjs/download/\">download here</a>) makes deployment of any Ext JS 4 application easier than ever. The tools allows you to generate a manifest of all dependencies in the form of a JSB3 (JSBuilder file format) file, and create a minimal custom build of just what your application needs within minutes.</p>\n\n<p>Please refer to the <a href=\"#/guide/getting_started\">Getting Started guide</a> for detailed instructions.</p>\n\n<h2>Next Steps</h2>\n\n<p>We've created a very simple application that manages User data and sends any updates back to the server. We started out simple and gradually refactored our code to make it cleaner and more organized. At this point it's easy to add more functionality to our application without creating spaghetti code. The full source code for this application can be found in the Ext JS 4 SDK download, inside the examples/app/simple folder.</p>\n\n<p>In the next guide, we'll look at advanced Controller usage and patterns that can make your application code smaller and easier to maintain.</p>\n"});