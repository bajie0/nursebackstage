<template>
  <el-container>
    <!-- 侧边栏 start -->
    <el-aside :width="this.$store.state.side_width">
      <Side></Side>
    </el-aside>
    <!-- 侧边栏 end -->
    <el-container>
      <!-- 置顶栏 start -->
      <el-header>
        <Header></Header>
      </el-header>
      <!-- 置顶栏 end -->
      <!-- 内容栏 start -->
      <el-main>
        <div class="ui-container">
          <div class="ui-container-header">
            <h2><i class="ion-ios-arrow-forward"></i>组织架构</h2>
            <p>对平台的组织直接的上下级关系进行配置，并呈现层级化显示。</p>
          </div>
          <!-- Form start -->
          <el-row class="ui-container-content ui-organize-relation">
            <el-col :span="5" v-if="page_type_get===true">
              <div class="ui-content ui-organize-side">
                <h3><i class="ion-ios-apps"></i>组织架构分类</h3>
                <ul>
                  <li :class="{'active':structure_list.indexOf(index)>-1}" v-for="(item,index) in structure_data"
                      :key="index" @click="changeStructureList(index,item.id)">
                    <i class="ion-ios-arrow-forward"></i>{{item.title}}
                    <el-link v-if="page_type_patch===true" @click="patchStructureType(item.id)">修改</el-link>
                    <el-link v-if="page_type_delete===true" @click="deleteStructureType(item.id)">删除</el-link>
                  </li>
                </ul>
                <div class="ui-organize-side-btn">
                  <el-button v-if="page_type_create===true" type="text" @click="createStructureType()">新增分类</el-button>
                  <el-button v-if="page_type_upload===true" type="text" @click="operate_upload()">批量设置</el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="19" v-if="page_get===true">
              <div class="ui-content">
                <RelationGraph class="ui-organize-images" ref="seeksRelationGraph" :options="graphOptions"
                               :on-node-click="onNodeClick"/>
              </div>
            </el-col>
          </el-row>
          <!-- Form end -->
        </div>
      </el-main>
      <!-- 内容栏 end -->
    </el-container>
    <!-- 新增分类 start -->
    <el-dialog v-if="page_type_create===true" title="新增分类" class="ui-dialog" :visible.sync="dialogAddType" width="30%"
               :close-on-click-modal="false">
      <el-form ref="formTypeContent" :model="formTypeContent" :label-position="labelTypePosition"
               :rules="formTypeRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="分类编码" prop="type_code">
              <el-input v-model="formTypeContent.type_code" placeholder="请输入分类编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类标题" prop="type_title">
              <el-input v-model="formTypeContent.type_title" placeholder="请输入分类标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="默认组织" prop="type_title">
              <el-select v-model="formTypeContent.type_organize" placeholder="请选择默认组织">
                <el-option v-for="item in organize_data" :key="item.id" :label="item.title+'（ '+item.code+' ）'"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddReset('formTypeContent')">取 消</el-button>
        <el-button type="primary" @click="formAddSubmit('formTypeContent')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增分类 end -->
    <!-- 设置下级组织 start -->
    <el-dialog v-if="page_create===true" title="设置下级组织" class="ui-dialog" :visible.sync="dialogAddRelation" width="50%"
               :close-on-click-modal="false" :before-close="handleCloseRelation">
      <el-form ref="formRelationContent" :model="formRelationContent" :label-position="labelRelationPosition"
               :rules="formRelationRules" label-width="130px">
        <el-tabs value="lower">
          <el-tab-pane label="下级节点" name="lower">
            <el-row>
              <el-col :span="24">
                <el-transfer class="ui-transfer" filterable :filter-method="filterOrganize"
                             filter-placeholder="请输入组织标题 / 组织编码" v-model="organize_value" :data="organize_list"
                             :titles="['待选组织', '已选组织']" @change="changeOrganize"></el-transfer>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="节点属性" name="current" style="padding-top: 20px">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="下级节点背景色">
                  <el-color-picker v-model="formRelationContent.background_color" @change="changeBackgroundColor"
                                   @active-change="changeBackgroundColor"></el-color-picker>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="下级节点宽度">
                  <el-input-number v-model="formRelationContent.width" :min="1" :max="1000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="下级节点高度">
                  <el-input-number v-model="formRelationContent.height" :min="1" :max="1000"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="本级节点背景色">
                  <el-color-picker v-model="formRelationContent.current_background_color"
                                   @change="changeCurrentBackgroundColor"
                                   @active-change="changeCurrentBackgroundColor"></el-color-picker>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="本级节点宽度">
                  <el-input-number v-model="formRelationContent.current_width" :min="1" :max="1000"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="本级节点高度">
                  <el-input-number v-model="formRelationContent.current_height" :min="1" :max="1000"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onRelationReset('formRelationContent')">取 消</el-button>
        <el-button type="primary" @click="formRelationSubmit('formRelationContent')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置下级组织 end -->
    <!-- 批量设置组织关系 start -->
    <el-drawer class="ui-upload" title="批量导入数据" :visible.sync="upload_all" :direction="upload_all_direction"
               :with-header="false" :before-close="uploadClose">
      <div class="ui-upload-header">
        <h2><i class="ion-ios-arrow-forward"></i>批量导入数据</h2>
        <p>对初始化数据进行批量导入。</p>
      </div>
      <div class="ui-upload-content">
        <h4>01.模板</h4>
        <a href="../../../static/template/组织关系模板.xlsx">
          <img src="../../../static/images/xls.png">
          <p>点击下载模板文件</p>
        </a>
        <span>
          <p>1、红色标题为必须输入内容；</p>
          <p>2、编码类列作为唯一值，如有重复则系统会提示错误；</p>
        </span>
        <h4>02.选择文件</h4>
        <el-upload drag :action="this.upload_url" :headers="{'token':this.$cookies.get('token')}" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <h4>03.上传反馈</h4>
        <el-input type="textarea" rows="11" v-model="upload_content"></el-input>
      </div>
    </el-drawer>
    <!-- 批量设置组织关系 end -->
  </el-container>
</template>
<script>
  import RelationGraph from 'relation-graph'
  import {
    ApiData,
    ApiCreate,
    ApiDelete,
  } from '@/axios/axios'

  export default {
    components: {RelationGraph},
    data() {
      return {
        // 页面权限
        page_type_create: false,
        page_type_get: false,
        page_type_patch: false,
        page_type_delete: false,
        page_type_upload: false,
        page_create: false,
        page_get: false,
        // 批量导入侧边栏
        upload_all: false,
        upload_all_direction: "rtl",
        // 批量导入组件
        upload_content: "",
        upload_url: "",
        FileUrl: '',
        // 组织架构图设置
        graphOptions: {
          // 当图谱的大小发生变化时，是否重新让图谱的内容看起来居中
          moveToCenterWhenResize: false,
          // 默认为根节点添加一个被选中的样式
          defaultFocusRootNode: false,
          // 是否在工具栏中显示切换线条形状的按钮
          allowSwitchLineShape: false,
          // 是否在工具栏中显示切换连接点位置的按钮
          allowSwitchJunctionPoint: false,
          // 布局方式，可以设置多个布局
          layouts: [
            {
              label: '横向',
              useLayoutStyleOptions: true,
              // 布局方式（tree树状布局/center中心布局/force自动布局）
              layoutName: 'tree',
              max_per_width: 250,
              min_per_width: 500,
              max_per_height: 250,
              min_per_height: 100,
              from: 'top',
              // 默认的节点展开/关闭按钮位置（left/top/right/bottom）
              defaultExpandHolderPosition: "bottom",
              // 默认的连线与节点接触的方式（border:边缘/ltrb:上下左右/tb:上下/lr:左右）
              defaultJunctionPoint: 'tb',
              // 默认的线条样式（1:直线/2:样式2/3:样式3/4:折线/5:样式5/6:样式6）
              defaultLineShape: 4,
              // 默认的节点形状，0:圆形；1:矩形
              defaultNodeShape: 1,
              // 默认的节点背景颜色
              defaultNodeColor: '#17233d',
              // 默认的节点边框粗细（像素）
              defaultNodeBorderWidth: 0,
              // 默认的节点边框颜色
              defaultNodeBorderColor: '#17233d',
              // 默认的节点文字颜色
              defaultNodeFontColor: '#FFF',
              // 默认的线条颜色
              defaultLineColor: '#e8eaec',
              // 默认的线条粗细（像素）
              defaultLineWidth: 1,
              // 默认的节点宽度
              defaultNodeWidth: 200,
              // 默认的节点高度
              defaultNodeHeight: 45,
            },
            {
              label: '竖向',
              useLayoutStyleOptions: true,
              // 布局方式（tree树状布局/center中心布局/force自动布局）
              layoutName: 'tree',
              min_per_width: 400,
              max_per_width: 700,
              max_per_height: 200,
              from: 'left',
              // 默认的节点展开/关闭按钮位置（left/top/right/bottom）
              defaultExpandHolderPosition: "right",
              // 默认的连线与节点接触的方式（border:边缘/ltrb:上下左右/tb:上下/lr:左右）
              defaultJunctionPoint: 'lr',
              // 默认的线条样式（1:直线/2:样式2/3:样式3/4:折线/5:样式5/6:样式6）
              defaultLineShape: 3,
              // 默认的节点形状，0:圆形；1:矩形
              defaultNodeShape: 1,
              // 默认的节点背景颜色
              defaultNodeColor: '#17233d',
              // 默认的节点边框粗细（像素）
              defaultNodeBorderWidth: 0,
              // 默认的节点边框颜色
              defaultNodeBorderColor: '#17233d',
              // 默认的节点文字颜色
              defaultNodeFontColor: '#FFF',
              // 默认的线条颜色
              defaultLineColor: '#e8eaec',
              // 默认的线条粗细（像素）
              defaultLineWidth: 1,
              // 默认的节点宽度
              defaultNodeWidth: 200,
              // 默认的节点高度
              defaultNodeHeight: 45,
            }
          ],
        },
        // 新增分类弹出框
        dialogAddType: false,
        // 新增分类表单设置
        labelTypePosition: 'top',
        formTypeContent: {
          type_code: '',
          type_title: '',
          type_organize: ''
        },
        // 新增分类Form验证
        formTypeRules: {
          type_code: [
            {required: true, message: "请输入分类编码", trigger: 'blur'}
          ],
          type_title: [
            {required: true, message: "请输入分类标题", trigger: 'blur'}
          ],
          type_organize: [
            {required: true, message: "请选择默认组织", trigger: 'change'}
          ]
        },
        // 新增分类Form URL
        structure_form_url: "/api/create/structure_type/",
        // 新增分类弹出框
        dialogAddRelation: false,
        // 新增分类表单设置
        labelRelationPosition: 'left',
        formRelationContent: {
          current_background_color: '#17233d',
          current_width: 200,
          current_height: 45,
          background_color: '#17233d',
          width: 200,
          height: 45,
          organize: '',
          superior: '',
          structure: ''
        },
        // 新增分类Form验证
        formRelationRules: {
          background_color: [
            {required: true, message: "请输入分类编码", trigger: 'blur'}
          ],
          organize: [
            {required: true, message: "请输入分类标题", trigger: 'blur'}
          ],
          superior: [
            {required: true, message: "请选择默认组织", trigger: 'change'}
          ]
        },
        // 穿梭框初始化
        organize_list: [],
        // 穿梭框基础数据
        organize_value: [],
        // 穿梭框查询
        filterOrganize(query, item) {
          return item.organize_code.indexOf(query) > -1;
        },
        // 组织架构列表
        structure_data: [],
        structure_list: [],
        structure_index: "",
        structure_id: "",
        // 组织明细列表
        organize_data: [],
        // 组织架构图数据
        framework_data: [],
        framework_nodes_data: [],
        framework_links_data: []
      }
    },
    created() {
      this.getStructureJson()
      this.getOrganizeJson()
      this.getPageAuthority()
    },
    methods: {
      // Form分类表单提交
      formAddSubmit(formTypeContent) {
        this.$refs[formTypeContent].validate((valid) => {
          if (valid) {
            let url = this.structure_form_url
            ApiCreate(url, this.formTypeContent).then((response) => {
              this.$message.success(response)
              this.getStructureJson()
            })
          }
        })
      },
      // 重置Form分类表单
      onAddReset(formTypeContent) {
        this.$refs[formTypeContent].resetFields()
        this.dialogAddType = false
      },
      // 分类数据 - 删除操作
      deleteStructureType(id) {
        this.$confirm("是否删除该数据？", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let url = "/api/delete/structure_type/"
          let params = {"id": id}
          ApiDelete(url, params).then((response) => {
            this.$message.success(response)
            this.getStructureJson()
          })
        });
      },
      // 分类数据 - 修改操作
      patchStructureType(id) {
        this.structure_form_url = "/api/patch/structure_type/?id=" + id
        this.dialogAddType = true
        let url = "/api/get/structure_form/?id=" + id
        ApiData(url).then((response) => {
          this.formTypeContent.type_title = response.form_data[0]['title']
          this.formTypeContent.type_code = response.form_data[0]['code']
          this.formTypeContent.type_organize = response.form_data[0]['organize_id']
        })
      },
      // 组织架构分类选择
      changeStructureList(index, id) {
        this.structure_index = index
        this.structure_id = id
        let arrIndex = this.structure_list.indexOf(index)
        if (arrIndex > -1) {
          this.structure_list = []
          this.structure_list.push(index)
        } else {
          this.structure_list = []
          this.structure_list.splice(arrIndex, 1)
          this.getFrameworkJson(id)
          this.formRelationContent.structure = id
        }
      },
      // 分类数据 - 新增操作
      createStructureType() {
        this.structure_form_url = "/api/create/structure_type/"
        this.dialogAddType = true
      },
      // 组织架构图
      showSeeksGraph() {
        var relation_organize_json = {
          rootId: 'a',
          nodes: this.framework_nodes_data,
          links: this.framework_links_data
        }
        this.$refs.seeksRelationGraph.setJsonData(relation_organize_json, (seeksRGGraph) => {
        })
      },
      // 引入StructureJson
      getStructureJson() {
        let url = "/api/get/structure_data/"
        ApiData(url).then((response) => {
          this.structure_data = response.data
        })
      },
      // 引入组织架构json
      getFrameworkJson(ID) {
        let url = "/api/get/framework_list/?id=" + ID
        ApiData(url).then((response) => {
          this.framework_nodes_data = response.nodes_data
          this.framework_links_data = response.links_data
          this.showSeeksGraph()
        })
      },
      // 引入组织json
      getOrganizeJson() {
        let url = "/api/get/organize_select/"
        ApiData(url).then((response) => {
          this.organize_data = response.data
        })
      },
      // 点击节点事件
      onNodeClick(nodeObject) {
        this.dialogAddRelation = true
        this.formRelationContent.superior = nodeObject.id
        let url = "/api/get/organize_relation_select/?structure_id=" + this.structure_id + "&superior_id=" + nodeObject.id
        ApiData(url).then((response) => {
          this.organize_value = response.data
          this.formRelationContent.current_width = response.style[0]
          this.formRelationContent.current_height = response.style[1]
          this.formRelationContent.current_background_color = response.style[2]
          var organize_value = ""
          for (var j = 0, len = response.data.length; j < len; j++) {
            organize_value = organize_value + "," + response.data[j]
          }
          this.formRelationContent.organize = organize_value.substring(1, organize_value.length)
        })
        this.organize_list = this.getRelationJson(this.structure_id, nodeObject.id)
      },
      // 当前背景颜色
      changeCurrentBackgroundColor(value) {
        this.formRelationContent.current_background_color = value
      },
      // 下级背景颜色
      changeBackgroundColor(value) {
        this.formRelationContent.background_color = value
      },
      // Form分类表单提交
      formRelationSubmit(formRelationContent) {
        this.$refs[formRelationContent].validate((valid) => {
          if (valid) {
            let url = "/api/create/relation_organize/"
            ApiCreate(url, this.formRelationContent).then((response) => {
              this.$message.success(response)
              this.changeStructureList(this.structure_index, this.structure_id)
            })
          }
        })
      },
      // 重置Form分类表单
      onRelationReset(formRelationContent) {
        this.$refs[formRelationContent].resetFields()
        this.dialogAddRelation = false
        this.changeStructureList(this.structure_index, this.structure_id)
      },
      // 关闭Form分类表单
      handleCloseRelation() {
        this.dialogAddRelation = false
        this.changeStructureList(this.structure_index, this.structure_id)
      },
      // 获取穿梭框数据
      changeOrganize(value) {
        let organize_change = ''
        for (var j = 0, len = value.length; j < len; j++) {
          organize_change = organize_change + value[j] + ","
        }
        this.formRelationContent.organize = organize_change.substring(0, organize_change.length - 1);
      },
      // 初始化穿梭框
      getRelationJson(id, value) {
        let list_data = []
        let url = "/api/get/organize_relation/?structure_id=" + id + "&superior_id=" + value
        ApiData(url).then((response) => {
          response.data.forEach((data, index) => {
            list_data.push({
              label: data.title + "（ " + data.code + " ）",
              key: data.id,
              organize_code: data.title + data.code
            })
          })
        })
        return list_data
      },
      // 13.01.批量上传
      operate_upload() {
        if (this.structure_id === "") {
          this.$message.error("请选择批量设置的组织架构")
        } else {
          this.upload_all = true
          this.upload_content = ""
          this.upload_url = this.$api_url + "/api/upload/relation_organize/?structure_id=" + this.structure_id
        }
      },
      handleAvatarSuccess(res, file) {
        this.FileUrl = URL.createObjectURL(file.raw)
        this.$message.success(res.message)
        this.upload_content = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.name.substr(file.name.lastIndexOf(".") + 1) === "xlsx"
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error("上传文件只能是xlsx格式!")
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过5MB!')
        }
        return isJPG && isLt2M;
      },
      // 13.03.关闭上传
      uploadClose() {
        this.upload_all = false
        this.changeStructureList(this.structure_index, this.structure_id)
      },
      // 19.页面权限验证
      getPageAuthority() {
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeTypeCreate") !== -1) {
          this.page_type_create = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeTypeGet") !== -1) {
          this.page_type_get = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeTypePatch") !== -1) {
          this.page_type_patch = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeTypeDelete") !== -1) {
          this.page_type_delete = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeTypeUpload") !== -1) {
          this.page_type_upload = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeCreate") !== -1) {
          this.page_create = true
        }
        if (this.$store.state.power_list.indexOf("HandleBusinessRelationOrganizeGet") !== -1) {
          this.page_get = true
        }
      }
    }
  }
</script>
