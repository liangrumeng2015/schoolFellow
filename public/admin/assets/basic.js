$(function(){
    app.confirmDelete();
})
var app = {
    toggle:function(el,collectionName,attr,id){
        $.get('/admin/changeStatus',{
            collectionName:collectionName,
            attr:attr,
            id:id
        },function(data){
            if(data.success){
                if(el.src.indexOf('yes')!=-1){
                    el.src = '/admin/assets/images/no.gif';
                } else {
                    el.src = '/admin/assets/images/yes.gif';
                }
            }
        })
    },
    confirmDelete:function(){   // 删除的弹框
        $('.delete').click(function(){
            var flag = confirm('您确定要删除？');
            return flag;
        })
    }
}