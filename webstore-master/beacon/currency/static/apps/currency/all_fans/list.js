(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('AllFansController', ListController);

    function ListController($timeout, User, current_user) {
        var ctrl = this;

        var fansData = {
            "name": current_user.username,
            "level": current_user.profile.member_level,
            "children": getJuniorFans(current_user.username)
        };

        function getJuniorFans(username) {
            var children = [];
            User.getFans({user: username}, function (data) {
                if (data.length > 0) {
                    data.forEach(function (user) {
                        var user_children = getJuniorFans(user.user.username);
                        children.push({
                            "name": user.user.username,
                            "level": user.member_level,
                            "children": user_children
                        });
                    });
                }
            });
            return children;
        }

        $timeout(function () {
            fansData.x0 = 0;
            fansData.y0 = 0;
            fansData.children.forEach(function (root) {
                root.children.forEach(collapse);
            });
            update(fansData);
        }, 1000);
        // ************** Generate the tree diagram	 *****************
        var margin = {top: 20, right: 1, bottom: 20, left: 1},
            windowWidth = $(window).width(), width,
            height = $(window).height() - margin.top - margin.bottom;

        if (windowWidth < 992) {
            width = windowWidth;
        } else {
            width = windowWidth - 235;
        }
        console.log(width)

        var i = 0, duration = 200;

        var tree = d3.layout.tree()
            .size([width, height]);

        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.x, d.y];
            });

        var svg = d3.select("#topology").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function update(source) {

            var nodes = tree.nodes(fansData).reverse(),
                links = tree.links(nodes);

            nodes.forEach(function (d) {
                d.y = d.depth * 200;
            });

            var node = svg.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .on("click", click);

            nodeEnter.append("svg:image")
                .attr("xlink:href", function (d) {
                     return "/static/apps/currency/common/img/" + d.level + ".ico";
                })
                .attr("x", function (d) {
                    return -20;
                })
                .attr("y", function (d) {
                    return -20;
                })
                .attr("height", 45)
                .attr("width", 45);

            nodeEnter.append("text")
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .attr("y", function (d) {
                    return d.children || d._children ? -18 : 18;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.name;
                })
                .style("fill-opacity", 1);

            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .remove();

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            var link = svg.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        function click(d) {
            // 根节点不收起
            if (!d.parent) {
                return
            }

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

    }
}(angular));
