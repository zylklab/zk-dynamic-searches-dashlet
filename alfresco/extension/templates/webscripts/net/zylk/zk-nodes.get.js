<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/evaluator.lib.js">
<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/filters.lib.js">
<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/parse-args.lib.js">


var nz = function(value, defaultvalue) {
	if (typeof (value) === undefined || value == null || value == "") {
		return defaultvalue;
	}
	return value;
};

var items = [];
var rootNode = args.rootNode;



if (args.query != null && args.query != undefined && args.query != "undefined" && args.query != "") {

	var sortColumn = nz(args.sort, "cm:modified");
	var sortOrder = nz(args.sortOrder, "desc");
	
	logger.log("--- sort by: "+ args.sort);
	logger.log("--- sort order: "+ args.sortOrder);
	
	var queryDef = "";

   /* -------------------------
   	*  tags & categories
   	* ---------------------------
   	*/
  
	if (args.filterTags) {
      	var filterTagNode;
      	for each(filter in args.filterTags.split(",")){
      		logger.log("-- filterTag: " + filter);
          
            filterTagNode = search.findNode(filter);       
	  		queryDef += " +PATH:\"" + filterTagNode.qnamePath + "/member\" ";
    	}
	}
  
  
    if (args.filterCategories){
        var filterCategoryNode;
        for each(category in args.filterCategories.split(",")){
			logger.log("-- filterCategory: "  + category);
          
          	filterCategoryNode = search.findNode(category);
          	queryDef += " +PATH:\"" + filterCategoryNode.qnamePath + "/member\" ";

        }   
  	}
       
    logger.debug("--- mimetype: " + args.mimetype);
    
    if(args.mimetype && args.mimetype != undefined){
    	queryDef += " +@cm\\:content.mimetype:\""+args.mimetype+"\" ";
    	
    }
	
    
    logger.debug("--- contentType: " + args.contentType);
    
    if(args.contentType && args.contentType != undefined){
    	queryDef += " +TYPE:\""+args.contentType+"\" ";
    	
    }
    
	
	var path = "/app:company_home";
	
	
	if (args.path != null && args.path != undefined && args.path != "") {

		var pathNode = search.findNode(args.path);
		path = pathNode.qnamePath;
		
	}

	path = path + "//*";

	var date = new Date();
	var toQuery = date.getFullYear() + "\\-" + (date.getMonth() + 1) + "\\-"
			+ date.getDate();
	date.setDate(date.getDate() - 7);
	var fromQuery = date.getFullYear() + "\\-" + (date.getMonth() + 1) + "\\-"
			+ date.getDate();

	// Construimos querys con fechas y usuarios (modificados y añadidos
	// recientemente)
	var dynamicQuery = args.query;

	if (dynamicQuery.indexOf("{USER}") != -1) {

		dynamicQuery = dynamicQuery.replace("{USER}",
				person.properties.userName);
	}

	if (dynamicQuery.indexOf("{FROMDATE}") != -1) {

		dynamicQuery = dynamicQuery.replace("{FROMDATE}", fromQuery);

	}

	if (dynamicQuery.indexOf("{TODATE}") != -1) {

		dynamicQuery = dynamicQuery.replace("{TODATE}", toQuery);

	}

	queryDef += dynamicQuery;

	
	
	// Si la query dinamica ya tiene path, no utilizamos el de configuración
	
	if(dynamicQuery.indexOf("PATH") != -1) {
		queryDef = queryDef + " -TYPE:\"cm:systemfolder\" -TYPE:\"fm:forums\" -TYPE:\"fm:forum\" -TYPE:\"fm:topic\" -TYPE:\"fm:post\"";
	}else {
		queryDef = "PATH:\"" + path + "\" AND " + queryDef + " -TYPE:\"cm:systemfolder\" -TYPE:\"fm:forums\" -TYPE:\"fm:forum\" -TYPE:\"fm:topic\" -TYPE:\"fm:post\"";
	}
	

	var maxItems = 20;
	if (args.maxItems != null) {

		maxItems = args.maxItems;
	}

	var page = {
		maxItems : parseInt(maxItems)
	}

	var sort1 = {
		column : "@" + sortColumn,
		ascending : (sortOrder == "asc")
	};
	var def = {
		query : queryDef,
		store : "workspace://SpacesStore",
		language : "lucene",
		sort : [ sort1 ],
		page : page

	};

	
	nodes = search.query(def);
	var item;
	
	for each (var node in nodes){

		
		var libraryRoot =  companyhome;
		
		 if (rootNode != "alfresco://company/home")
         {
			 libraryRoot =  ParseArgs.resolveNode(rootNode);
         }

		 
		 var location = Common.getLocation(node, libraryRoot);

		 if(node.qnamePath.indexOf("sites") != -1){
	 		location = Common.getLocation(node, null);
		 }
	         

	  	 item = Evaluator.run(node);
		 item.location = location;
		 item.tags = node.tags;
			
		 items.push(item);
	}
	
	logger.log("\n-- query: " + queryDef + " resultados: " + items.length);
	//logger.warn("\n-- query: " + queryDef + " resultados: " + items.length);
}

model.items = items;