/**
*@author: casa
*
*@date: 2014-08-28
*
*@note: functionNavModel
*
*/
(function(vm){
	vm["NavInfoList"] = ko.mapping.fromJS({
		navList : []
	});
})(this.ViewModel);
$(function(){
	ko.applyBindings(ViewModel.NavInfoList);
    var list = [];
	list.push({id : '1', name : '导入话单', link : '#'});
	list.push({id : '2', name : '话单转码', link : '#'});
	list.push({id : '3', name : '操作历史', link : '#'});
	ViewModel.NavInfoList.navList(list);
});