<template>
	<div class="activation " v-loading="loading">
		<div>
			<div>
				<crumbs>
					<div class slot="crumbs">
						<el-breadcrumb separator=">">
							<el-breadcrumb-item>运营中心</el-breadcrumb-item>
							<el-breadcrumb-item>激活码管理</el-breadcrumb-item>
							<el-breadcrumb-item>激活码详情</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
				</crumbs>
			</div>
			<div class="searchData">
				<div>
					<span>激活码:</span>
					<span><el-input v-model="searchData.cdkey"   clearable  placeholder style="width: 130px;"></el-input></span>
				</div>
				<div>
					<div>
						<span>激活码类型:</span>
						<span>
							<el-select v-model="searchData.packageId" clearable>
								<el-option v-for="item in terminalTypeList" :key="item.id" :label="item.packageName" :value="item.id"></el-option>
							</el-select>
						</span>
					</div>
				</div>
				<div>
					<span>激活者账号:</span>
					<span><el-input v-model="searchData.number"  clearable  placeholder style="width: 130px;"></el-input></span>
				</div>
				<div class="time">
					<span class="pxs">激活码有效期:</span>
					<el-date-picker
						v-model="searchData.time"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="input-class"
						@change="codes"
					></el-date-picker>
				</div>
				<div class="time">
					<span class="pxs">激活时间:</span>
					<el-date-picker
						v-model="searchData.establishs"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						class="input-class"
						@change="establishs"
					></el-date-picker>
				</div>
				<div>
					<div>
						<span>状态:</span>
						<span>
							<el-select v-model="searchData.status" clearable style="width: 130px;">
								<el-option v-for="item in states" :key="item.value" :label="item.name" :value="item.value"></el-option>
							</el-select>
						</span>
					</div>
				</div>
			</div>
			<div class="btnss">
				<div class="tihsi">
					<span>共有激活码{{ this.totals }}个，已激活{{ this.pages }}个</span>
				</div>
				<div class="anniu">
					<el-button type="primary" @click="query">失效查询结果</el-button>
					<el-button type="primary" @click="Disable">失效选中激活码</el-button>
					<el-button type="danger" @click="code">删除激活码</el-button>
					<el-button type="primary" @click="exports">下载激活码</el-button>
					<el-button type="primary" @click="inquirer">查询</el-button>
					<el-button @click="criteria">重置查询条件</el-button>
				</div>
			</div>
		</div>
		<el-table :data="tableData" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="序号" prop="index" min-width="30%" type="index"></el-table-column>
			<el-table-column label="激活码" prop="text" min-width="100%">
				<template slot-scope="scope">
					<p>{{ scope.row.cdkey }}</p>
				</template>
			</el-table-column>
			<el-table-column label="激活码类型" prop="type" min-width="100%">
				<template slot-scope="scope">
					<p>{{ scope.row.packageName }}</p>
				</template>
			</el-table-column>
			<el-table-column label="激活者账号" prop="xh" min-width="100%">
				<template slot-scope="scope">
					<p>{{ scope.row.number }}</p>
				</template>
			</el-table-column>
			<el-table-column label="激活时间" prop="xh" min-width="100%">
				<template slot-scope="scope">
					<!-- <p  v-if="scope.row.activationTime  == ''  "> </p> -->
					<p v-if="scope.row.activationTime">{{scope.row.activationTime | formatDate}}</p>
				</template>
			</el-table-column>
			<el-table-column label="激活码有效期" prop="xh" min-width="100%">
				<template slot-scope="scope">
					<p>{{ scope.row.termValidityTime | formatDate }}</p>
				</template>
			</el-table-column>
			<el-table-column label="状态" prop="xh" min-width="100%">
				<template slot-scope="scope">
					<p>{{ scope.row.status | batch }}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" min-width="100px">
				<template slot-scope="scope">
					<el-button type="danger" v-if="scope.row.status == 0 ? true : false" @click="Invalid(scope.row)">失效</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="list_page">
			<el-pagination
				background
				layout="prev, pager, next,total,jumper"
				:page-size="page.size"
				:current-page="page.num + 1"
				@current-change="pagechange"
				:total="page.total"
			></el-pagination>
		</div>
	</div>
</template>
<script>
import util from '@/lib/util';
import axios from 'axios';
import config from '@/lib/global';
import { formatDay, formatDate, formatSecond, formatYear, formatDates, GetYearStr } from '@/lib/time';
import crumbs from '@/components/common/Crumbs';
export default {
	created() {
		this.activationId = this.$route.params.row.id;
		this.searchData.packageId = this.$route.params.row.packageId;
		this.activations();
		this.packages();
	},
	components: {
		crumbs
	},
	props: ['See'],
	data() {
		return {
			formatDate:false,
			activationId: '',
			loading: false,
			ada: '',
			//搜索
			searchData: {
				cdkey: '',
				packageName: '',
				number: '',
				status: '',
				time: '',
				establishs: '',
				termValidityBeginTime: new Date().getFullYear() + '' + '-' + '' + '01' + '-' + '' + '01'+' ' + '00'+':'+'00'+':' +'00' ,
				termValidityEndTime: new Date().getFullYear() + '' + '-' + '' + '12' + '-' + '' + '31'+' ' + '23'+':'+'59'+':'+'59',
				packageId: '',
				activationBeginTime: "",
				activationEndTime: "",
				ids:[]
			},

			//表格
			tableData: [],
			terminalTypeList: [],
			states: [
				{
					value: '',
					name: '全部'
				},
				{
					value: '0',
					name: '未激活'
				},
				{
					value: '1',
					name: '已激活'
				},
				{
					value: '2',
					name: '已失效'
				},
				{
					value: '3',
					name: '已过期'
				}
			],
			page: {
				total: 0,
				size: 15,
				num: 0,
				serialnumber: 0
			},
			aggregate: [],
			arrId: [],
			totals: '',
			pages: '',
			download:[],
		};
	},
	methods: {
		//失效
		async Invalid(row) {
			this.arrId.push(row.id);

			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016003'
					},
					body: {
						ids: this.arrId
					}
				};
			try {
				let res = await util.ajax.post(Url, params);
				this.activations();
			} catch (e) {
				//TODO handle the exception
			}
		},
		//获取列表详情
		async activations() {
			this.loading = true;
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016004'
					},

					body: {
						// beginTime:this.searchData.beginTime,
						// endTime:this.searchData.endTime,
						pageSize: this.page.size,
						pageNum: this.page.num,
						activationId: this.activationId,
						termValidityBeginTime: this.searchData.termValidityBeginTime,
						termValidityEndTime: this.searchData.termValidityEndTime,
						packageId: this.searchData.packageId
					}
				};
			this.loading = true;
			try {
				let res = await util.ajax.post(Url, params);
				this.tableData = res.data.body.data.datas;
				this.totals = res.data.body.data.total;
				this.pages = res.data.body.data.pages;
				this.page.pageSize = res.data.body.data.pageSize;
				this.page.total = res.data.body.data.total;
				this.loading = false;
			} catch (e) {}
		},
		//查询服务套餐列表
		async packages() {
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001015001'
					},

					body: {
						pageNum:0,
				        pageSize: 10000,
					}
				};

			try {
				let res = await util.ajax.post(Url, params);
				this.terminalTypeList = res.data.body.data.datas;
               
				 
			} catch (e) {}
		},
		//全选
		handleSelectionChange(val) {
			this.arrId = val;
		},
		//分页
		pagechange(val) {
			this.page.num = val - 1;
			this.inquirer();
		},

		//失效选中激活码
		async Disable() {
			if (this.arrId == '') {
				return;
			}
			for (var i = 0; i < this.arrId.length; i++) {
				this.aggregate.push(this.arrId[i].id);
			}
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016003'
					},
					body: {
						ids: this.aggregate
					}
				};
			try {
				let res = await util.ajax.post(Url, params);
				this.activations();
			} catch (e) {
				//TODO handle the exception
			}
		},
		//失效查询结果
		async query() {
			if (this.arrId == '') {
				return;
			}

			for (var i = 0; i < this.arrId.length; i++) {
				this.aggregate.push(this.arrId[i].id);
			}
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016003'
					},
					body: {
						ids: this.aggregate
					}
				};
			try {
				let res = await util.ajax.post(Url, params);
				this.activations();
			} catch (e) {
				//TODO handle the exception
			}
		},
		//删除激活码
		async code() {
		
			if (this.arrId == '') {
				return;
			}
				this.loading = true;
			this.aggregate = [];
			for (var i = 0; i < this.arrId.length; i++) {
				this.aggregate.push(this.arrId[i].id);
			}
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016005'
					},
					body: {
						ids: this.aggregate
					}
				};
			try {
				let res = await util.ajax.post(Url, params);
				this.loading = false;
				this.activations();
			} catch (e) {
				//TODO handle the exception
			}
		},
		//重置查询条件
		criteria() {
			this.searchData.cdkey = '';
			this.searchData.packageName = '';
			this.searchData.number = '';
			this.searchData.status = '';
			this.searchData.time = '';
			this.searchData.establishs = '';
			this.searchData.termValidityBeginTime = new Date().getFullYear() + '' + '-' + '' + '01' + '-' + '' + '01'+' ' + '00'+':'+'00'+':'+'00';
			this.searchData.termValidityEndTime = new Date().getFullYear() + '' + '-' + '' + '12' + '-' + '' + '31'+' '+ '23'+':'+'59'+':'+'59';
			this.searchData.packageId = '';
			this.searchData.activationBeginTime = "";
			this.searchData.activationEndTime ="";
			this.searchData.states = "";
			this.activations()
		},
	codes() {
		this.searchData.termValidityBeginTime = '';
			this.searchData.termValidityBeginTime = formatDay(this.searchData.time[0])+' ' + '00'+':'+'00'+':'+'00';
			this.searchData.termValidityEndTime = '';
			this.searchData.termValidityEndTime = formatDay(this.searchData.time[1])+' '+ '23'+':'+'59'+':'+'59';
		 

		},
		establishs() {
			this.searchData.activationBeginTime = ""
			this.searchData.activationBeginTime = formatDay(this.searchData.establishs[0]) +' ' + '00'+':'+'00'+':'+'00';
			this.searchData.activationEndTime = ""
			this.searchData.activationEndTime = formatDay(this.searchData.establishs[1])+' '+ '23'+':'+'59'+':'+'59';
			
		},
		//查询
	async	inquirer() {
			 
			let Url = '',
				params = {
					reqHead: {
						functionId: 'DWA001016004'
					},

					body: {
						cdkey:this.searchData.cdkey,
						packageName:this.searchData.packageName,
						number:this.searchData.number,
						activationBeginTime: this.searchData.activationBeginTime ,
						activationEndTime: this.searchData.activationEndTime  ,
						termValidityBeginTime: this.searchData.termValidityBeginTime ,
						termValidityEndTime: this.searchData.termValidityEndTime ,
						status:this.searchData.status,
						pageSize: this.page.size,
						pageNum: this.page.num,
						activationId: this.activationId,
						packageId: this.searchData.packageId
					}
				};
			try {
				let res = await util.ajax.post(Url, params);
				this.tableData = res.data.body.data.datas;
				this.page.pageSize = res.data.body.data.pageSize;
				
			} catch (e) {}
		},
		//下载
		async exports() {
			 this.searchData.ids = [];
			if (this.arrId == '') {
				return;
			}
				this.loading = true;
		for(var i = 0; i<this.arrId.length;i++){
			this.searchData.ids.push(this.arrId[i].id)
		}
			delete this.searchData.time;
			delete this.searchData.establishs;
			let Url = config.developmentUrl.host1 + 'file/downActivationCode';
			this.loading = true;
			let res = await axios({
				url: Url,
				method: 'post',
				data: {
					  cdkey:this.searchData.cdkey,
				packageName: this.searchData.packageName,
				number: this.searchData.number,
				status: this.searchData.status,
				
				termValidityBeginTime:this.searchData.termValidityBeginTime ,
				termValidityEndTime: this.searchData.termValidityEndTime,
				packageId: this.searchData.packageId,
				activationBeginTime: this.searchData.activationBeginTime,
				activationEndTime: this.searchData.activationEndTime,
				ids:this.searchData.ids
				}  ,
				responseType: 'blob'
			});
			this.loading = false;
			try {
				if (res.data.size > 0) {
					this.d_loading = false;
					let url = window.URL.createObjectURL(new Blob([res.data]));
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					link.setAttribute('download', `${formatSecond(new Date().getTime())}.xlsx`);
					document.body.appendChild(link);
					link.click();
				} else {
					this.d_loading = false;
					this.$message.error(`${res.data.respHead.respMsg}`);
				}
			} catch (e) {
				this.d_loading = false;
				this.$message.error('网络连接错误，请检查网络连接，再重新尝试!');
			}
		}
	},
	filters: {
		formatDate: function(value) {
			let date = new Date(value);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? '0' + MM : MM;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;
			let h = date.getHours();
			h = h < 10 ? '0' + h : h;
			let m = date.getMinutes();
			m = m < 10 ? '0' + m : m;
			let s = date.getSeconds();
			s = s < 10 ? '0' + s : s;
			return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
		},
		batch: function(val) {
			switch (val) {
				case 0:
					return ' 未激活';
					break;
				case 1:
					return ' 已激活';
				case 2:
					return ' 已失效';
					break;
			}
		}
	}
};
</script>
<style>
.activation {
	
}
.activation .searchData {
	display: flex;
	flex-wrap: wrap;
}
.activation .searchData div {
	/* display: flex;
	flex-wrap: wrap; */
	height: 100%;
	line-height: 50px
}
.activation .searchData div span {
	height: 40px;
	line-height: 40px;
	padding-left: 10px;
}
.activation .el-date-editor--datetimerange.el-input__inner {
		width: 360px;
		height: 40px;
}
.activation .btnss .anniu {
	float: right;
	margin-top: 10px;
}
.activation .btnss .tihsi span {
	float: left;
	height: 60px;
	line-height: 60px;
	box-sizing: border-box;
}
</style>
