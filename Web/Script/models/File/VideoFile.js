/**
*@author: casa
*
*@date: 2014-08-28
*
*@note: FileModel
*
*/
(function(vm){
	vm["FileInfo"] = ko.mapping.fromJS({
		id : '',
		name : '',
		fullname : '',
		audioFormat : '',
		encoding : '',
		rate : '',
		audioChannel : '',
		httpBaseUrl : ''
	});

	vm["FileInfoList"] = ko.mapping.fromJS({
		fileList : [],
		getFileList : function(){

		}
	});
})(this.ViewModel);
$(function(){
	// ko.applyBindings(ViewModel.FileInfo);
	// ko.applyBindings(ViewModel.FileInfoList);
});