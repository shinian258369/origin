<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{
          item.name
        }}
      </el-checkbox>
    </el-checkbox-group>
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnOK">确定</el-button>
          <el-button @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 确定时
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配角色成功')
      this.btnCancel()
    },
    btnCancel() {
      this.$emit('update:showRoleDialog', false) // 关闭窗口
      this.roleIds = [] // 重新置空
    }
  }

}
</script>

<style>

</style>
