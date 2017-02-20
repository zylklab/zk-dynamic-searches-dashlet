/*
 *       Get Latest Document configuration component POST method
 */

function main()
{

	var c = sitedata.getComponent(url.templateArgs.componentId);

	var saveValue = function(name, value)
	{
        c.properties[name] = value;
        model[name] = value;
	}
	
	saveValue("title", String(json.get("title")));
	saveValue("filterTags", 		String(json.get("filterTags")));
	saveValue("filterCategories", 	String(json.get("filterCategories")));
	saveValue("sortOrder", 			String(json.get("sortOrder")));
	saveValue("sort", 				String(json.get("sort")));
	saveValue("mimetype", 			String(json.get("mimetype")));
	saveValue("maxItems", 			String(json.get("maxItems")));
	saveValue("filterPath",			String(json.get("filterPath")));
	saveValue("contentType", 		String(json.get("contentType")));
	
	if (String(json.get("filterPath")) != ""){
		saveValue("filterPathView", String(json.get("filterPath")).split("|")[1]);		
	}else{
		saveValue("filterPathView", "");
	}
	
	if (json.has("hideQueries")){
		saveValue("hideQueries", "true");		
	}else{
		saveValue("hideQueries", "false");
	}
	
	if (json.has("defaultQuery")){
		saveValue("defaultQuery", String(json.get("defaultQuery")));	
	}
	
	if (json.has("defaultQueryLabel")){
		saveValue("defaultQueryLabel", String(json.get("defaultQueryLabel")));	
	}
	
	if (json.has("customQuery")){
		saveValue("customQuery", String(json.get("customQuery")));	
	}

	c.save();
}

main();