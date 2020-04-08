<template>
	<div class="searchBox">
		<slot name="searchBox"></slot>
	</div>
</template>

<script>
	export default {
		data() {
			return {};
		},
		components: {}
	};
</script>

<style lang="scss">
	.searchBox {
		border-bottom: 1px solid darkgrey;
		padding-bottom: 18px;
		width: 100%;
		font-size: 14px;
		box-sizing: border-box;

		.line {
			display: flex;
			width: 100%;
			margin-bottom: 10px;

			&>div {
				display: flex;
				flex: 0 0 25%;
				align-items: center;

				.el-select {
					width: 100%;
				}
			}

			.Larges {
				flex: 0 0 40%;
			}

			.Times {
				&>div {
					width: 100%;
				}
			}
		}

		.line-3 {
			display: flex;
			width: 100%;
			margin-bottom: 10px;

			&>div {
				display: flex;
				flex: 0 0 30%;
				align-items: center;

				.el-select {
					width: 100%;
				}
			}
		}

		.end-2 {
			display: flex;
			width: 100%;
			margin-bottom: 10px;
			justify-content: space-between;
			align-items: center;

			&>div {
				display: flex;
				flex: 0 0 50%;
				align-items: center;

				.el-select {
					width: 100%;
				}
			}
		}

		.end-3 {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			margin-bottom: 10px;
			justify-content: space-between;
			align-items: center;

			&>div {
				display: flex;
				flex: 1;
				align-items: center;

				.el-select {
					width: 100%;
				}
			}
		}

		.el-button {
			margin-left: 30px;
		}

		.l_line_Multiple {
			display: flex;
			width: 100%;

			.Multiple_item {
				display: flex;
				flex: 1;
				align-items: center;

				.Names {
					min-width: 90px;
					text-align: right;
					padding-right: 10px;
					box-sizing: border-box;
				}
			}
		}

		.tudan-flex {
			display: flex;
		}

		.flex-20 {
			flex: 0 0 20%;
		}

		.flex-40 {
			flex: 0 0 40%;
		}

		.flex-15 {
			flex: 0 0 15% !important;
		}

		.flex-18 {
			flex: 0 0 18% !important;
		}

		.flex-23 {
			flex: 0 0 23% !important;
		}

		.flex-24 {
			flex: 0 0 24% !important;
		}

		.flex-0-40 {
			flex: 0 0 40% !important;
		}

		.flex-0-31 {
			flex: 0 0 31% !important;
		}

		.flex-25 {
			flex: 0 0 25% !important;
		}

		.flex-28 {
			flex: 0 0 28% !important;
		}

		.flex-100 {
			flex: 0 0 100% !important;
		}

		.Names {
			min-width: 80px;
			text-align: right;
			padding-right: 10px;
			box-sizing: border-box;
		}

		.Names-large {
			min-width: 110px;
		}

		.ecg-line {
			display: flex;
			width: 100%;
			margin-bottom: 10px;

			&>div {
				display: flex;
				flex: 0 0 23%;
				align-items: center;

				&>div {
					width: 100% !important;
				}

				.el-select {
					width: 100%;
				}
			}
		}

		.tudan-flex-18 {
			display: flex;
			width: 100%;
			margin-bottom: 10px;

			&>div {
				display: flex;
				flex: 0 0 18%;
				align-items: center;

				&>div {
					width: 100% !important;
				}

				.el-select {
					width: 100%;
				}
			}
		}

		.tudan-flex-1 {
			display: flex;
			width: 100%;
			margin-bottom: 10px;
			justify-content: space-between;
			align-items: center;

			&>div {
				display: flex;
				flex: 1;
				align-items: center;

				.el-select {
					width: 100%;
				}
			}
		}

		.seek_line {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			margin-bottom: 10px;

			&>div {
				display: flex;
				flex: 1;
				align-items: center;
				box-sizing: border-box;

				&>div {
					width: 100% !important;
				}

				.el-select {
					width: 100%;
				}
			}
		}
	}
</style>
