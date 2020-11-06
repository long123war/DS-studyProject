<template>
    <div class="login-background">
        <div class="login-box">
            <!-- 头像区域 -->
            <div class="head-box">
                <img src="../assets/logo.png">
            </div>
            <!-- 表单区域 -->
            <el-form ref="form" label-width="80px" class="login-from">
                <el-form-item label="活动名称">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.login-background{
    background-color: #2b4b6b;
    height: 100%;
    .login-box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .head-box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            box-shadow: 0px 0px 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            padding: 10px;
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
        .login-from{
           box-sizing: border-box;
        }
    }
}
</style>
