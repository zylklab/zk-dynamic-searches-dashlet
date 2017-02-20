<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">

function runEvaluator(evaluator)
{
   return eval(evaluator);
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






/* Max Items */
function getMaxItems()
{
   var myConfig = new XML(config.script),
      maxItems = myConfig["max-items"];

   if (maxItems)
   {
      maxItems = myConfig["max-items"].toString();
   }
   return parseInt(maxItems && maxItems.length > 0 ? maxItems : 50, 10);
}

/*
 * cargamos config dashlet
 */
var conf = new XML(config.script);

// hidePreferences
if (conf.hidePreferences[0]){
	args.hidePreferences = conf.hidePreferences[0].toString();
	logger.log(args.hidePreferences);
	
}else{
	args.hidePreferences = true;
}
	

/*
 * cargamos config instancia
 */
var regionId = args['region-id'];
model.regionId = regionId;

model.preferences = AlfrescoUtil.getPreferences("org.alfresco.share.mydynamicsearches.dashlet." + regionId);
model.prefSimpleView = model.preferences.simpleView;
if (model.prefSimpleView == null){
   model.prefSimpleView = true;
}

// isAdmin
var personResult = remote.call("/api/people/" + encodeURIComponent(user.id));
if (personResult.status == 200){
    var person = eval('(' + personResult + ')');
    model.isAdmin = person.capabilities.isAdmin;
}


/* 
 * las preferencias de la instancia del dashlet llegan como argumentos
 */

// HINT: Disabling Mode 1 and 2
//model.filterQueries = getQueries();
model.filterQueries = [];
model.defaultQuery = args.defaultQuery || "";
model.defaultQueryLabel = args.defaultQueryLabel || "";
//model.customQuery = args.customQuery || "";
// Very important
model.customQuery = args.customQuery || " ";
model.hideQueries = args.hideQueries || "false";
model.hidePreferences = args.hidePreferences;
model.maxItems = getMaxItems();
model.rootNode = config.scoped['RepositoryLibrary']['root-node'].value;
model.title = args.title || "Custom Search";
model.maxItems = args.maxItems || "20";
model.filterPath = args.filterPath || "";   
model.filterPathView = args.filterPathView || "";
model.filterTags = args.filterTags || "";
model.filterCategories = args.filterCategories || "";
model.sort = args.sort|| "cm:modified";
model.sortOrder = args.sortOrder || "desc";
model.mimetype = args.mimetype || "";
model.prefSimpleView = true; // TODO
model.contentType=args.contentType || "cm:content";