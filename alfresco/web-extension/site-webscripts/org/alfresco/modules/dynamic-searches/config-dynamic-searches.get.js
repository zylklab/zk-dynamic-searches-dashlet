<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">


function runEvaluator(evaluator)
{
   return eval(evaluator);
}

function getSorting()
{

	 // New Content
	var myConfig = new XML(config.script);
    var sortOptions = [],
       sortingConfig = myConfig.sorting;

    if (sortingConfig !== null)
    {
          for each(var configItem in myConfig..sort)
          {
             sortOptions.push(
             {
                value: configItem.toString(),                   
                label: configItem.@label.toString()
             });
             
          }
       }
    
    return sortOptions;

}


/* Get Queries */
function getQueries()
{
   var filters = [];
   var result = remote.call("/net/zylk/dynamicQueries");
   if (result.status == 200)
   {
      var data = eval('(' + result + ')');
      var queries = data.queries;

           for each (var query in queries)
           {
              filters.push(
              {
                 type: query.queryType,
                 label: query.queryName
              });
           }
   }
   return filters;
}

/* Get Mimetypes */
function getMimetypes() {
    var filters = [];
    var result = remote.call("/api/actionConstraints");
    if (result.status == 200) {
	    var constraintsArr = eval('(' + result + ')').data;
	    var constraintsObj = {};

	    for (var i = 0, il = constraintsArr.length, constraint; i < il; i++){
	        constraint = constraintsArr[i];
	        constraintsObj[constraint.name] = constraint.values;
	        if (constraint.name == "ac-mimetypes"){
              constraint.values.sort(function(a, b){
                  if(a.displayLabel < b.displayLabel) return -1;
                  if(a.displayLabel > b.displayLabel) return 1;
                  return 0;
              })      	   
	        	  for each (var mimetype in constraint.values) {
	                filters.push(
	                {
	                   value: mimetype.value,
	                   label: mimetype.displayLabel
	                });
	          }
	        }

	    }       
    }
    return filters;
}

function getTypes()
{

	// New Content
	var myConfig = new XML(config.script);
    var typeOptions = [],
       typesConfig = myConfig.types;

    if (typesConfig !== null)
    {
          for each(var configItem in myConfig..type)
          {
        	  typeOptions.push(
             {
                value: configItem.toString(),                   
                label: configItem.@label.toString()
             });
             
          }
       }
    
    return typeOptions;

}


model.filterSorting = getSorting();
model.filterQueries = getQueries();
model.filterMimetypes = getMimetypes();
model.filterTypes = getTypes();