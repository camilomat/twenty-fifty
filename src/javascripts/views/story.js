window.twentyfifty.views.story = function() {

  this.setup = function() {
    $("#results").append("<div id='stories'><div id='demand_story' class='story'></div><div id='supply_story' class='story'></div><div id='ghg_story' class='story'></div><div class='clear'></div></div>");
  };

  this.teardown = function() {
    $("#results").empty();
  };

  this.updateResults = function(pathway) {
    this.pathway = pathway;
    this.choices = twentyfifty.choices;

    element = $('#demand_story');
    element.empty();
    this.stories_for_choices(element, "Edificaciones en 2050", 25,27,28,29,30);
    this.stories_for_choices(element, "Industria en 2050", 32, 33);
    this.stories_for_choices(element, "Transporte en 2050", 35, 36,38,39); //Agregar importaciones
    this.stories_for_choices(element, "Hidrocarburos en 2050", 35, 36,38,39);

    element = $('#supply_story');
    element.empty();
    

    this.stories_for_choices(element, "Energia no renovable en 2050", 0, 1);
    //this.heating_choice_table(element, this.pathway.heating, "Residential");
    this.stories_for_choices(element, "Energia renovable en 2050",2, 3, 4, 5, 6, 7, 8, 9, 10);
    this.stories_for_choices(element, "Energia en zonas no interconectadas en 2050",11);
    //this.heating_choice_table(element, this.pathway.heating, "Commercial");
    this.stories_for_choices(element, "Biocombustibles en 2050", 13);
    this.stories_for_choices(element, "Combustibles fósiles en 2050" ,15, 16, 18, 19,20);
    this.stories_for_choices(element, "Residuos en 2050", 22,23);
 
    element = $('#ghg_story');
    element.empty();
    this.stories_for_choices(element, "Agricultura y ganaderia en 2050", 42,43,44,45);
    this.stories_for_choices(element, "Bosques plantados y naturales en 2050", 47,48);
    this.electricity_generation_capacity_table(element);
  //  element.append("<h4>Gases de efecto invernadero</h4>");
   // element.append("<p>Las emisiones de la aviación internacional y transporte marítimo no son incluidas en el objetivo para el año 2050, pero son incluidas aquí para permitir el calculo de las emisiones para todos los sectores que se deben considerar.</p>");

   // element.append("<h4>Energy security</h4>");
    //this.stories_for_choices(element, null, 42); no hay descripcion para aviacion internacional
   // element.append("<p>If there are five cold, almost windless, winter days, then up to " + (Math.round(this.pathway.balancing[2][this.pathway.balancing[2].length - 1])) + " GW of backup generation capacity will be required to ensure that electricity is always available.</p>"); Corresponde a la parte de seguridad que no esta en el modelo.
   // this.stories_for_choices(element, null, 22, 15); corresponde a Bionergy imports e importacion de electricidad (no esta en hoja de control)
  };

  this.stories_for_choices = function(element, title) {
    var choice, row, rows, text, _i, _len;
    rows = arguments.length <= 2 ? [] : Array.prototype.slice.call(arguments, 2);
    if (title != null) {
      element.append("<h4>" + title + "</h4>");
    }
    text = [];
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      choice = choices[row] - 1;
      if (choice % 1 === 0.0) {
        text.push(window.twentyfifty.longDescriptions[row][choice]);
      } else {
        text.push("Between " + window.twentyfifty.longDescriptions[row][Math.floor(choice)] + " and " + window.twentyfifty.longDescriptions[row][Math.ceil(choice)]);
      }
    }
    element.append("<p>" + (text.join(". ")) + ".</p>");
  };

  this.heating_choice_table = function(element, heat, column_name) {
    var html, name, value, values, _i, _len;
    html = [];
    html.push("<table class='heating_choice'>");
    html.push("<tr><th>Type of heater</th><th class='target'>2050 proportion of heating</th></tr>");

    // The first row of the table has the column names
    column_index = heat[0].indexOf(column_name);

    values = [];
    // Go through the table and pick out the data from the relevant column
    heat.slice(1).forEach(function(row) {
      values.push({
        name: row[0],
        value: row[column_index]
      });
    });

    // Biggest first
    values.sort(function(a, b) {
      return b.value - a.value;
    });

    // Move the total to the end
    values.push(values.shift());

    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      if (value.value > 0.01) {
        html.push("<tr><td>" + value.name + "</td><td class='target'>" + (Math.round(value.value * 100)) + "%</td></tr>");
      }
    }
    html.push("</table>");
    element.append(html.join(''));
  };

  this.electricity_generation_capacity_table = function(element) {
    var data, html, name, value, values, _i, _len, _ref;
    html = [];
    html.push("<table class='heating_choice'>");
    html.push("<tr><th>Capacidad instalada en GW</th><th class='target'>2010</th><th class='target'>2050</th></tr>");

    capacity = this.pathway.electricity.capacity;

    values = [];
    
    // The first row of the table has the column names
    name_index = capacity[0].indexOf("Sector");
    index_2010 = capacity[0].indexOf(2010);
    index_2050 = capacity[0].indexOf(2050);

    // Go through the table and pick out the data from the relevant column
    capacity.slice(1).forEach(function(row) {
      values.push({
        name: row[name_index],
        d2010: row[index_2010],
        d2050: row[index_2050] 
      });
    });

    // Biggest first
    values.sort(function(a, b) {
      return b.d2050 - a.d2050;
    });
     
    // Move the total to the end
    values.push(values.shift());
    
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      value = values[_i];
      if ((value.d2010 + value.d2050) !== 0.0) {
        html.push("<tr><td>" + value.name + "</td><td class='target'>" + (Math.round(value.d2010)) + "</td><td class='target'>" + (Math.round(value.d2050)) + "</td></tr>");
      }
    }
    html.push("</table>");
    element.append(html.join(''));
  };

  return this;

}.call({});
