var sort1 = {
	column : "@cm:title",
	ascending : true
};
var def = {
	query : "/app:company_home/app:dictionary/cm:Dynamic_x0020_Queries//*",
	store : "workspace://SpacesStore",
	language : "xpath",
	sort : [ sort1 ]	

};

var nodes = search.query(def);

if(nodes != undefined){
	model.queries = nodes;
}