(function(QUnit) {
    "use strict";

    var view;

    QUnit.module("Backbone.View", {

        beforeEach: function() {
            $("#qunit-fixture").append(
                "<div id=\"testElement\"><h1>Test</h1></div>"
            );

            view = new Backbone.View({
                id: "test-view",
                className: "test-view",
                other: "non-special-option"
            });
        },

        afterEach: function() {
            $("#testElement").remove();
            $("#test-view").remove();
        }

    });

    QUnit.test("constructor", function(assert) {
        assert.expect(3);
        assert.equal(view.el.id, "test-view");
        assert.equal(view.el.className, "test-view");
        assert.equal(view.el.other, void 0);
    });

    QUnit.test("$", function(assert) {
        assert.expect(2);
        var myView = new Backbone.View();
        myView.setElement("<p><a><b>test</b></a></p>");
        var result = myView.$("a b");

        assert.strictEqual(result[0].innerHTML, "test");
        assert.ok(result.length === +result.length);
    });

    QUnit.test("$el", function(assert) {
        assert.expect(3);
        var myView = new Backbone.View();
        myView.setElement("<p><a><b>test</b></a></p>");
        assert.strictEqual(myView.el.nodeType, 1);

        assert.ok(myView.$el instanceof Backbone.$);
        assert.strictEqual(myView.$el[0], myView.el);
    });

    QUnit.test("initialize", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            initialize: function() {
                this.one = 1;
            }
        });

        assert.strictEqual(new View().one, 1);
    });

    QUnit.test("preinitialize", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            preinitialize: function() {
                this.one = 1;
            }
        });

        assert.strictEqual(new View().one, 1);
    });

    QUnit.test("preinitialize occurs before the view is set up", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            preinitialize: function() {
                assert.equal(this.el, undefined);
            }
        });
        var _view = new View({});
        assert.notEqual(_view.el, undefined);
    });

    QUnit.test("render", function(assert) {
        assert.expect(1);
        var myView = new Backbone.View();
        assert.equal(myView.render(), myView, "#render returns the view instance");
    });

    QUnit.test("delegateEvents", function(assert) {
        assert.expect(6);
        var counter1 = 0,
            counter2 = 0;

        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.increment = function() {
            counter1++;
        };
        myView.$el.on("click", function() {
            counter2++;
        });

        var events = {
            "click h1": "increment"
        };

        myView.delegateEvents(events);
        myView.$("h1").trigger("click");
        assert.equal(counter1, 1);
        assert.equal(counter2, 1);

        myView.$("h1").trigger("click");
        assert.equal(counter1, 2);
        assert.equal(counter2, 2);

        myView.delegateEvents(events);
        myView.$("h1").trigger("click");
        assert.equal(counter1, 3);
        assert.equal(counter2, 3);
    });

    QUnit.test("delegate", function(assert) {
        assert.expect(3);
        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.delegate("click", "h1", function() {
            assert.ok(true);
        });
        myView.delegate("click", function() {
            assert.ok(true);
        });
        myView.$("h1").trigger("click");

        assert.equal(myView.delegate(), myView, "#delegate returns the view instance");
    });

    QUnit.test("delegateEvents allows functions for callbacks", function(assert) {
        assert.expect(3);
        var myView = new Backbone.View({
            el: "<p></p>"
        });
        myView.counter = 0;

        var events = {
            click: function() {
                this.counter++;
            }
        };

        myView.delegateEvents(events);
        myView.$el.trigger("click");
        assert.equal(myView.counter, 1);

        myView.$el.trigger("click");
        assert.equal(myView.counter, 2);

        myView.delegateEvents(events);
        myView.$el.trigger("click");
        assert.equal(myView.counter, 3);
    });

    QUnit.test("delegateEvents ignore undefined methods", function(assert) {
        assert.expect(0);
        var myView = new Backbone.View({
            el: "<p></p>"
        });
        myView.delegateEvents({
            click: "undefinedMethod"
        });
        myView.$el.trigger("click");
    });

    QUnit.test("undelegateEvents", function(assert) {
        assert.expect(7);
        var counter1 = 0,
            counter2 = 0;

        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.increment = function() {
            counter1++;
        };
        myView.$el.on("click", function() {
            counter2++;
        });

        var events = {
            "click h1": "increment"
        };

        myView.delegateEvents(events);
        myView.$("h1").trigger("click");
        assert.equal(counter1, 1);
        assert.equal(counter2, 1);

        myView.undelegateEvents();
        myView.$("h1").trigger("click");
        assert.equal(counter1, 1);
        assert.equal(counter2, 2);

        myView.delegateEvents(events);
        myView.$("h1").trigger("click");
        assert.equal(counter1, 2);
        assert.equal(counter2, 3);

        assert.equal(myView.undelegateEvents(), myView, "#undelegateEvents returns the view instance");
    });

    QUnit.test("undelegate", function(assert) {
        assert.expect(1);
        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.delegate("click", function() {
            assert.ok(false);
        });
        myView.delegate("click", "h1", function() {
            assert.ok(false);
        });

        myView.undelegate("click");

        myView.$("h1").trigger("click");
        myView.$el.trigger("click");

        assert.equal(myView.undelegate(), myView, "#undelegate returns the view instance");
    });

    QUnit.test("undelegate with passed handler", function(assert) {
        assert.expect(1);
        var myView = new Backbone.View({
            el: "#testElement"
        });
        var listener = function() {
            assert.ok(false);
        };
        myView.delegate("click", listener);
        myView.delegate("click", function() {
            assert.ok(true);
        });
        myView.undelegate("click", listener);
        myView.$el.trigger("click");
    });

    QUnit.test("undelegate with selector", function(assert) {
        assert.expect(2);
        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.delegate("click", function() {
            assert.ok(true);
        });
        myView.delegate("click", "h1", function() {
            assert.ok(false);
        });
        myView.undelegate("click", "h1");
        myView.$("h1").trigger("click");
        myView.$el.trigger("click");
    });

    QUnit.test("undelegate with handler and selector", function(assert) {
        assert.expect(2);
        var myView = new Backbone.View({
            el: "#testElement"
        });
        myView.delegate("click", function() {
            assert.ok(true);
        });
        var handler = function() {
            assert.ok(false);
        };
        myView.delegate("click", "h1", handler);
        myView.undelegate("click", "h1", handler);
        myView.$("h1").trigger("click");
        myView.$el.trigger("click");
    });

    QUnit.test("tagName can be provided as a string", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            tagName: "span"
        });

        assert.equal(new View().el.tagName, "SPAN");
    });

    QUnit.test("tagName can be provided as a function", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            tagName: function() {
                return "p";
            }
        });

        assert.ok(new View().$el.is("p"));
    });

    QUnit.test("_ensureElement with DOM node el", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            el: document.body
        });

        assert.equal(new View().el, document.body);
    });

    QUnit.test("_ensureElement with string el", function(assert) {
        assert.expect(3);
        var View = Backbone.View.extend({
            el: "body"
        });
        assert.strictEqual(new View().el, document.body);

        View = Backbone.View.extend({
            el: "#testElement > h1"
        });
        assert.strictEqual(new View().el, $("#testElement > h1").get(0));

        View = Backbone.View.extend({
            el: "#nonexistent"
        });
        assert.ok(!new View().el);
    });

    QUnit.test("with className and id functions", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            className: function() {
                return "className";
            },
            id: function() {
                return "id";
            }
        });

        assert.strictEqual(new View().el.className, "className");
        assert.strictEqual(new View().el.id, "id");
    });

    QUnit.test("with attributes", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            attributes: {
                "id": "id",
                "class": "class"
            }
        });

        assert.strictEqual(new View().el.className, "class");
        assert.strictEqual(new View().el.id, "id");
    });

    QUnit.test("with attributes as a function", function(assert) {
        assert.expect(1);
        var View = Backbone.View.extend({
            attributes: function() {
                return {
                    "class": "dynamic"
                };
            }
        });

        assert.strictEqual(new View().el.className, "dynamic");
    });

    QUnit.test("should default to className/id properties", function(assert) {
        assert.expect(4);
        var View = Backbone.View.extend({
            className: "backboneClass",
            id: "backboneId",
            attributes: {
                "class": "attributeClass",
                "id": "attributeId"
            }
        });

        var myView = new View();
        assert.strictEqual(myView.el.className, "backboneClass");
        assert.strictEqual(myView.el.id, "backboneId");
        assert.strictEqual(myView.$el.attr("class"), "backboneClass");
        assert.strictEqual(myView.$el.attr("id"), "backboneId");
    });

    QUnit.test("multiple views per element", function(assert) {
        assert.expect(3);
        var count = 0;
        var $el = $("<p></p>");

        var View = Backbone.View.extend({
            el: $el,
            events: {
                click: function() {
                    count++;
                }
            }
        });

        var view1 = new View();
        $el.trigger("click");
        assert.equal(1, count);

        new View();
        $el.trigger("click");
        assert.equal(3, count);

        view1.delegateEvents();
        $el.trigger("click");
        assert.equal(5, count);
    });

    QUnit.test("custom events", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            el: $("body"),
            events: {
                fake$event: function() {
                    assert.ok(true);
                }
            }
        });

        new View();
        $("body").trigger("fake$event").trigger("fake$event");

        $("body").off("fake$event");
        $("body").trigger("fake$event");
    });

    QUnit.test("#1048 - setElement uses provided object.", function(assert) {
        assert.expect(2);
        var $el = $("body");

        var myView = new Backbone.View({
            el: $el
        });
        assert.ok(myView.$el === $el);

        myView.setElement($el = $($el));
        assert.ok(myView.$el === $el);
    });

    QUnit.test("#986 - Undelegate before changing element.", function(assert) {
        assert.expect(1);
        var button1 = $("<button></button>");
        var button2 = $("<button></button>");

        var View = Backbone.View.extend({
            events: {
                click: function(e) {
                    assert.ok(myView.el === e.target);
                }
            }
        });

        var myView = new View({
            el: button1
        });
        myView.setElement(button2);

        button1.trigger("click");
        button2.trigger("click");
    });

    QUnit.test("#1172 - Clone attributes object", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            attributes: {
                foo: "bar"
            }
        });

        var view1 = new View({
            id: "foo"
        });
        assert.strictEqual(view1.el.id, "foo");

        var view2 = new View();
        assert.ok(!view2.el.id);
    });

    QUnit.test("views stopListening", function(assert) {
        assert.expect(0);
        var View = Backbone.View.extend({
            initialize: function() {
                this.listenTo(this.model, "all x", function() {
                    assert.ok(false);
                });
                this.listenTo(this.collection, "all x", function() {
                    assert.ok(false);
                });
            }
        });

        var myView = new View({
            model: new Backbone.Model(),
            collection: new Backbone.Collection()
        });

        myView.stopListening();
        myView.model.trigger("x");
        myView.collection.trigger("x");
    });

    QUnit.test("Provide function for el.", function(assert) {
        assert.expect(2);
        var View = Backbone.View.extend({
            el: function() {
                return "<p><a></a></p>";
            }
        });

        var myView = new View();
        assert.ok(myView.$el.is("p"));
        assert.ok(myView.$el.has("a"));
    });

    QUnit.test("events passed in options", function(assert) {
        assert.expect(1);
        var counter = 0;

        var View = Backbone.View.extend({
            el: "#testElement",
            increment: function() {
                counter++;
            }
        });

        var myView = new View({
            events: {
                "click h1": "increment"
            }
        });

        myView.$("h1").trigger("click").trigger("click");
        assert.equal(counter, 2);
    });

    QUnit.test("remove", function(assert) {
        assert.expect(2);
        var myView = new Backbone.View();
        document.body.appendChild(view.el);

        myView.delegate("click", function() {
            assert.ok(false);
        });
        myView.listenTo(myView, "all x", function() {
            assert.ok(false);
        });

        assert.equal(myView.remove(), myView, "#remove returns the view instance");
        myView.$el.trigger("click");
        myView.trigger("x");

        // In IE8 and below, parentNode still exists but is not document.body.
        assert.notEqual(myView.el.parentNode, document.body);
    });

    QUnit.test("setElement", function(assert) {
        assert.expect(3);
        var myView = new Backbone.View({
            events: {
                click: function() {
                    assert.ok(false);
                }
            }
        });
        myView.events = {
            click: function() {
                assert.ok(true);
            }
        };
        var oldEl = myView.el;
        var $oldEl = myView.$el;

        myView.setElement(document.createElement("div"));

        $oldEl.click();
        myView.$el.click();

        assert.notEqual(oldEl, myView.el);
        assert.notEqual($oldEl, myView.$el);
    });

    QUnit.test("set className in extend", function(assert) {
        assert.expect(3);

        var ChildView1 = Backbone.View.extend("ChildView1");
        assert.equal(ChildView1.className, "ChildView1");

        var ChildView2 = Backbone.View.extend("ChildView2", {});
        assert.equal(ChildView2.className, "ChildView2");

        var ChildView3 = Backbone.View.extend("ChildView3", {}, {});
        assert.equal(ChildView3.className, "ChildView3");
    });

    QUnit.test("{events: \".some\"}, check event.target on right selector", function(assert) {
        var counter1 = 0,
            counter2 = 0,
            counter3 = 0,
            counter4 = 0;

        var ChildView = Backbone.View.extend("ChildView", {
            template: "<div class=\"div1\"><div class=\"div1-div\"></div></div><div class=\"div2\"><div class=\"div2-div\"></div></div>",
            events: {
                "click .div1": function() {
                    counter1++;
                },
                "click .div2": function() {
                    counter2++;
                },
                "click .div1-div": function() {
                    counter3++;
                },
                "click .div2-div": function() {
                    counter4++;
                }
            }
        });

        var view = new ChildView();
        view.render();

        view.$(".div1").trigger("click");
        assert.equal(counter1, 1);
        assert.equal(counter2, 0);
        assert.equal(counter3, 0);
        assert.equal(counter4, 0);

        view.$(".div2").trigger("click");
        assert.equal(counter1, 1);
        assert.equal(counter2, 1);
        assert.equal(counter3, 0);
        assert.equal(counter4, 0);

        view.$(".div1-div").trigger("click");
        assert.equal(counter1, 2);
        assert.equal(counter2, 1);
        assert.equal(counter3, 1);
        assert.equal(counter4, 0);

        view.$(".div2-div").trigger("click");
        assert.equal(counter1, 2);
        assert.equal(counter2, 2);
        assert.equal(counter3, 1);
        assert.equal(counter4, 1);

    });

    QUnit.test("child view events not bubbling to parent view, but bubbling to window", function(assert) {
        var counter1 = 0,
            counter2 = 0,
            counter3 = 0;

        var ChildView = Backbone.View.extend("ChildView", {
            template: "<button></button>",
            events: {
                "click button": function() {
                    counter1++;
                }
            }
        });

        var ParentView = Backbone.View.extend("ParentView", {
            template: "<button></button><% ChildView() %>",
            Views: [ChildView],

            events: {
                "click button": function() {
                    counter2++;
                }
            }
        });

        $(document.body).on("click", function() {
            counter3++;
        });

        var parentView = new ParentView();
        parentView.render();
        parentView.$el.appendTo("body");

        parentView.$("button").eq(1).trigger("click");

        assert.equal(counter1, 1);
        assert.equal(counter2, 0);
        assert.equal(counter3, 1);

        parentView.$("button").eq(0).trigger("click");

        assert.equal(counter1, 1);
        assert.equal(counter2, 1);
        assert.equal(counter3, 2);

    });

    QUnit.test("menu", function(assert) {
        var MenuItemView = Backbone.View.extend({
            tagName: "li",
            template: "#menu-item-template",

            options: {
                lvl: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                children: {
                    type: Array,
                    default: []
                }
            },

            className: function() {
                var children = this.options.children,
                    classes = [];

                if ( children && children.length ) {
                    classes.push("has-children");
                }

                classes.push("lvl-" + this.options.lvl);

                return classes;
            }
        });

        var MenuCollectionView = Backbone.View.extend({
            tagName: "ul",
            template: "#menu-collection-template",
            className: function() {
                return "lvl-" + this.options.lvl;
            },

            options: {
                lvl: {
                    type: Number,
                    default: 1
                }
            },

            Views: {
                Item: MenuItemView
            }
        });

        MenuItemView.addView("Menu", MenuCollectionView);

        var menu = new MenuCollectionView({
            collection: [
                {
                    name: "Item 1"
                },
                {
                    name: "Item 2",
                    children: [
                        {
                            name: "Item 2.1"
                        },
                        {
                            name: "Item 2.2"
                        }
                    ]
                }
            ]
        });

        menu.render();

        assert.equal(menu.$("a").eq(0).text(), "Item 1");
        assert.equal(menu.$("a").eq(1).text(), "Item 2");
        assert.equal(menu.$("a").eq(2).text(), "Item 2.1");
        assert.equal(menu.$("a").eq(3).text(), "Item 2.2");

        assert.ok(menu.$el.hasClass("lvl-1"));

        assert.ok( !menu.$("li").eq(0).hasClass("has-children") );
        assert.ok( menu.$("li").eq(0).hasClass("lvl-1") );

        assert.ok( menu.$("li").eq(1).hasClass("has-children") );
        assert.ok( menu.$("li").eq(1).hasClass("lvl-1") );

        assert.ok( menu.$("ul").hasClass("lvl-2") );
        assert.ok( menu.$("ul li").eq(0).hasClass("lvl-2") );
        assert.ok( menu.$("ul li").eq(1).hasClass("lvl-2") );
    });

    QUnit.test("view.ui", function(assert) {
        var counter = 0;
        var Child1 = Backbone.View.extend();
        var Child2 = Backbone.View.extend();
        var View = Backbone.View.extend({
            Views: {
                Child1: Child1,
                Child2: Child2
            },
            template: `
                <div id="id">
                    <div class="class1"></div>
                    <div class="class2"></div>
                </div>
                <% Child1({ className: "class3" }) %>
                <% Child1({ className: "class4" }) %>
                <% Child2({ className: "class4" }) %>
            `,

            ui: {
                id: "#id",
                class1: ".class1",
                class2: ".class2",
                $id: "#id",
                $class1: ".class1",
                $class2: ".class2",
                some: "div#id div.class1",

                child1: "Child1",
                child2: "Child2",

                child1class3: "Child1.class3",
                child1class4: "Child1.class4",
                child2class4: "Child2.class4",

                noChild1: ".Child1",
                noChild2: "#Child2"
            },

            events: {
                "click @ui.class2": "onClickClass2"
            },

            onClickClass2: function() {
                counter++;
            }
        });

        var view = new View();
        view.render();

        assert.ok(view.ui.id instanceof Element);
        assert.ok(view.ui.id.id == "id");
        assert.ok(view.ui.class1 instanceof Element);
        assert.ok(view.ui.class1.className == "class1");
        assert.ok(view.ui.class2 instanceof Element);
        assert.ok(view.ui.class2.className == "class2");
        assert.ok(view.ui.some instanceof Element);
        assert.ok(view.ui.some.className == "class1");

        assert.ok(view.ui.child1 instanceof Child1);
        assert.ok(view.ui.child1class3 instanceof Child1);
        assert.ok(view.ui.child1class4 instanceof Child1);
        assert.ok(view.ui.child2 instanceof Child2);
        assert.ok(view.ui.child2class4 instanceof Child2);

        assert.ok(view.ui.noChild1 == null);
        assert.ok(view.ui.noChild2 == null);

        assert.ok(view.ui.$id instanceof Backbone.$);
        assert.ok(view.ui.$id.attr("id") == "id");
        assert.ok(view.ui.$class1 instanceof Backbone.$);
        assert.ok(view.ui.$class1.attr("class") == "class1");
        assert.ok(view.ui.$class2 instanceof Backbone.$);
        assert.ok(view.ui.$class2.attr("class") == "class2");

        view.render();

        assert.ok(view.ui.id instanceof Element);
        assert.ok(view.ui.id.id == "id");
        assert.ok(view.ui.class1 instanceof Element);
        assert.ok(view.ui.class1.className == "class1");
        assert.ok(view.ui.class2 instanceof Element);
        assert.ok(view.ui.class2.className == "class2");
        assert.ok(view.ui.some instanceof Element);
        assert.ok(view.ui.some.className == "class1");

        assert.ok(view.ui.child1 instanceof Child1);
        assert.ok(view.ui.child1class3 instanceof Child1);
        assert.ok(view.ui.child1class4 instanceof Child1);
        assert.ok(view.ui.child2 instanceof Child2);
        assert.ok(view.ui.child2class4 instanceof Child2);

        assert.ok(view.ui.noChild1 == null);
        assert.ok(view.ui.noChild2 == null);

        assert.ok(view.ui.$id instanceof Backbone.$);
        assert.ok(view.ui.$id.attr("id") == "id");
        assert.ok(view.ui.$class1 instanceof Backbone.$);
        assert.ok(view.ui.$class1.attr("class") == "class1");
        assert.ok(view.ui.$class2 instanceof Backbone.$);
        assert.ok(view.ui.$class2.attr("class") == "class2");

        assert.ok(counter == 0);
        view.$(".class2").trigger("click");
        assert.ok(counter == 1);
    });

    QUnit.test("view attributes", function(assert) {
        var ChildView = Backbone.View.extend({
            tagName: "span",
            attributes: {
                id: 1,
                class: "nice",
                "some-attr": "<"
            }
        });

        var ParentView = Backbone.View.extend({
            Views: {Child: ChildView},
            template: "<% Child() %>"
        });

        var view = new ParentView();
        view.render();

        assert.equal( view.$("span").attr("id"), 1 );
        assert.equal( view.$("span").attr("class"), "nice" );
        assert.equal( view.$("span").attr("some-attr"), "<" );
    });

    QUnit.test("view options", function(assert) {
        var View, view;

        View = Backbone.View.extend({
            options: {
                bool: Boolean,
                numb: Number,
                str: String,
                arr: Array,
                obj: Object,
                date: Date
            }
        });

        view = new View({
            bool: true,
            numb: 1,
            str: "nice",
            arr: [{a: 1}],
            obj: {x: 2}
        });

        assert.equal(view.options.bool, true);
        assert.equal(view.options.numb, 1);
        assert.equal(view.options.str, "nice");
        assert.equal(view.options.arr[0].a, 1);
        assert.equal(view.options.obj.x, 2);

        // must be error
        try {
            view = new View({ numb: NaN });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ numb: "1" });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ bool: 1 });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }

        try {
            view = new View({ str: 1 });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }

        try {
            view = new View({ arr: false });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ obj: 1 });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ date: 1 });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }

        // no error
        view = new View({ numb: -1.8 });
        assert.ok(true, "numb -1.8");

        view = new View({ str: "" });
        assert.ok(true, "str \"\"");

        view = new View({ bool: false });
        assert.ok(true, "bool false");

        view = new View({ bool: true });
        assert.ok(true, "bool true");

        view = new View({ obj: {} });
        assert.ok(true, "obj {}");

        view = new View({ arr: [] });
        assert.ok(true, "arr []");
    });

    QUnit.test("view options required, validate", function(assert) {
        var View, view;

        View = Backbone.View.extend({
            options: {
                req: {required: true},
                reqNumb: {type: Number, required: true},
                reqArr: {type: Array, required: true},
                reqBool: {type: Boolean, required: true},

                validNumb: {type: Number, validate: function(value) { return value >= 0; }},
                validStr: {type: String, validate: /^\w+$/}
            }
        });

        view = new View({
            req: false,
            reqNumb: -1,
            reqArr: [],
            reqBool: false,
            validNumb: 0,
            validStr: "test"
        });

        assert.strictEqual( view.options.req, false );
        assert.strictEqual( view.options.reqNumb, -1 );
        assert.ok( view.options.reqArr && view.options.reqArr.length === 0 );
        assert.strictEqual( view.options.reqBool, false );
        assert.strictEqual( view.options.validNumb, 0 );
        assert.strictEqual( view.options.validStr, "test" );


        View = Backbone.View.extend({
            options: {
                test: {required: true}
            }
        });
        try {
            view = new View({});
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            // !!! null can be from db, and it valid value
            view = new View({ test: null });
            assert.ok(true);
        } catch(err) {
            assert.ok(false);
        }

        View = Backbone.View.extend({
            options: {
                test: {required: true, nulls: false}
            }
        });
        try {
            view = new View({});
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            // nulls === false
            view = new View({ test: null });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }


        View = Backbone.View.extend({
            options: {
                str: {validate: /^\w+$/}
            }
        });
        try {
            // only not null values will validated
            view = new View({});
            assert.ok(true);
        } catch(err) {
            assert.ok(false);
        }
        try {
            view = new View({ str: "" });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ str: "!" });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }
        try {
            view = new View({ str: "nice" });
            assert.ok(true);
        } catch(err) {
            assert.ok(false);
        }


        View = Backbone.View.extend({
            options: {
                numb: {validate: function(value) {return value >= 0; }}
            }
        });
        try {
            // only not null values will validated
            view = new View({});
            assert.ok(true);
        } catch(err) {
            assert.ok(false);
        }
        try {
            // only not null values will validated
            view = new View({ numb: -1 });
            assert.ok(false);
        } catch(err) {
            assert.ok(true);
        }

        View = Backbone.View.extend({
            some1: function() {},
            options: {
                checkContext: {
                    validate: function() {
                        assert.ok( _.isFunction( this.some1 ) );
                        return true;
                    }
                }
            }
        });
        new View({
            checkContext: 1
        });

    });

    QUnit.test("child event with className", function(assert) {
        var Child = Backbone.View.extend("Child", {
            template: "<button></button>",
            events: {
                "click button": "onClickButton"
            },

            onClickButton: function() {
                this.trigger("some");
            }
        });

        var counter = 0;
        var Parent = Backbone.View.extend({
            Views: [Child],
            template: "<div id='test'><% Child({className: 'test'}) %></div>",

            events: {
                "foo Child": "onFoo",
                "some #test Child.test": "onSome"
            },

            onFoo: function() {
                counter++;
            },

            onSome: function() {
                counter++;
            }
        });

        var parent = new Parent();
        parent.render();

        assert.strictEqual(counter, 0);
        parent.$("button").trigger("click");

        assert.strictEqual(counter, 1);

        for (var cid in parent.children) {
            parent.children[cid].trigger("foo");
        }

        assert.strictEqual(counter, 2);
    });

    QUnit.test("child event with @ui", function(assert) {
        var Child = Backbone.View.extend("Child", {
            template: "<button></button>",
            events: {
                "click button": "onClickButton"
            },

            onClickButton: function() {
                this.trigger("some");
            }
        });

        var counter = 0;
        var Parent = Backbone.View.extend({
            Views: [Child],
            template: "<div id='test'><% Child({className: 'test'}) %></div>",

            ui: {
                "child": "#test Child.test"
            },

            events: {
                "foo @ui.child": "onFoo",
                "some @ui.child": "onSome"
            },

            onFoo: function() {
                counter++;
            },

            onSome: function() {
                counter++;
            }
        });

        var parent = new Parent();
        parent.render();

        assert.strictEqual(counter, 0);
        parent.$("button").trigger("click");

        assert.strictEqual(counter, 1);

        for (var cid in parent.children) {
            parent.children[cid].trigger("foo");
        }

        assert.strictEqual(counter, 2);
    });

    QUnit.test("2 children, listen events", function(assert) {
        var Child1 = Backbone.View.extend("Child1", {
            template: "<button></button>",
            events: {
                "click button": "onClickButton"
            },

            onClickButton: function() {
                this.trigger("some");
            }
        });

        var Child2 = Backbone.View.extend("Child2", {
            template: "<button></button>",
            events: {
                "click button": "onClickButton"
            },

            onClickButton: function() {
                this.trigger("some");
            }
        });

        var counter1 = 0,
            counter2 = 0;
        var Parent = Backbone.View.extend({
            Views: [Child1, Child2],
            template: "<div id='test'><% Child1({className: 'test'}); Child2({className: 'test'}) %></div>",

            events: {
                "some #test Child1.test": "onChild1",
                "some #test Child2.test": "onChild2"
            },

            onChild1: function() {
                counter1++;
            },

            onChild2: function() {
                counter2++;
            }
        });

        var parent = new Parent();
        parent.render();

        assert.strictEqual(counter1, 0);
        assert.strictEqual(counter2, 0);

        parent.$("button").eq(0).trigger("click");
        assert.strictEqual(counter1, 1);
        assert.strictEqual(counter2, 0);

        parent.$("button").eq(1).trigger("click");
        assert.strictEqual(counter1, 1);
        assert.strictEqual(counter2, 1);

    });

})(QUnit);
