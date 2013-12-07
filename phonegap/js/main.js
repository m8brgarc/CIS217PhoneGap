$(document).ready(function(){


    var order = [];
    var total = 0.00;
    var pizzas = [];
    var drinks = [];
    var pizza;
    var drink;
    $("#mypanel").append("<ul id='listStart'></ul>");

    if (localStorage.getItem('order') != null){
        var obj = JSON.parse( localStorage['order'] );
        for ( var item in obj){
            if(obj[item].size != null){
                pizzas.push(obj[item]);
            }
            if(obj[item].name != null){
                drinks.push(obj[item]);
            }
        }
        if (pizzas.length != 0){
            for(var p in pizzas){
                $("#listStart").append("<li>" + pizzas[p].size + " " + pizzas[p].crust + " Crust " + pizzas[p].top + "Pizza: $" + pizzas[p].price.toFixed(2).toString() +"</li>");
                total += pizzas[p].price;
            }
            $("#total").text("$" + total.toFixed(2).toString());
        }
        if (drinks.length != 0){
            for(var d in drinks){
                $("#listStart").append("<li>" + drinks[d].qty.toString() + "x "+ drinks[d].name + ": $" + drinks[d].price.toFixed(2).toString() + "</li>");
                total += drinks[d].price;
            }
            $("#total").text("$" + total.toFixed(2).toString());
        }
    }

    //$("#mypanel").panel("open");

    $("#addPizza").on("click", function(){
        pizza = new Object();
        pizza.price = 0.00;
        pizza.top = "";
        var size = $("input[name='size']");
        size.each(function(){
            if ($(this).prop("checked")){
                pizza.size = $(this).data("size");
                pizza.price += parseFloat($(this).data("price"));
            }
        });
        var topping = $("input.top");
        topping.each(function(){
            if($(this).prop("checked")){
                pizza.top += $(this).data("top") + " ";
                pizza.price += parseFloat($(this).data("price"));
            }
        });
        var crust = $("input[name='crust']");
        crust.each(function(){
            if($(this).prop("checked")){
                pizza.crust = $(this).prop("value");
                pizza.price += parseFloat($(this).data("price"));
            }
        });
        pizzas.push(pizza);

        if(pizza.top == ""){
            pizza.top = "Cheese";
        }
        $("#listStart").append("<li>" + pizza.size + " " + pizza.crust + " Crust " + pizza.top + "Pizza: $" + pizza.price.toFixed(2).toString() +"</li>");
        total += pizza.price;
        $("#total").text("$" + total.toFixed(2).toString());
        navigator.notification.alert("Pizza has been added to your Order.");
    });

    $("#addDrink").on("click", function(){
        var drinkElem = $("input[data-drink]");
        var drinkprice = parseFloat($("#drinkList").data("price"));
        drinkElem.each(function(){
            if(parseInt($(this).prop("value")) > 0){
                drink = new Object();
                drink.name = $(this).data("drink");
                drink.qty = parseInt($(this).prop("value"));
                drink.price = parseFloat(drinkprice * drink.qty);
                drinks.push(drink);
            }
        });

        for (var i = 0; i < drinks.length; i++){
            $("#listStart").append("<li>" + drinks[i].qty.toString() + "x "+ drinks[i].name + ": $" + drinks[i].price.toFixed(2).toString() + "</li>");
            total += drinks[i].price;
        }
        $("#total").text("$" + total.toFixed(2).toString());
        navigator.notification.alert("Drink Selection added to your Order.");
    });

    $("#fOrder").on("click", function(){
        var orderStr = "[";
        for (var p in pizzas){
            orderStr += JSON.stringify( pizzas[p] ) + ", ";
            order.push(pizzas[p]);
        }
        for (var d in drinks){
            orderStr += JSON.stringify( drinks[d]) + ", ";
            order.push(drinks[d]);
        }
        orderStr = orderStr.substring(0, orderStr.length - 2);
        orderStr += "]";
        localStorage['order'] = orderStr;
    });

    $("#submitOrder").on("click", function(){
        var orderURL = "";
        if (pizzas.length != 0){
            for(var p in pizzas){
                orderURL += "&pizza[]=" + pizzas[p].size + "X" + pizzas[p].crust + "X" + pizzas[p].top + "&p_price[]=" + pizzas[p].price.toFixed(2).toString();
            }
        }
        if (drinks.length != 0){
            for(var d in drinks){
                orderURL += "&drink[]=" + drinks[d].qty.toString() + "X" + drinks[d].name + "&d_price[]=" + drinks[d].price.toFixed(2).toString();
            }
        }
        orderURL += "&total=" + total.toFixed(2).toString();
        $.getJSON('http://cis217-4.codestyx.com/order.php?' + orderURL, function(data){
            navigator.notification.beep(2);
            navigator.notification.vibrate(1000);
            navigator.notification.alert(data);
        });
    });
});