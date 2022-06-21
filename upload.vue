<template>
    <input
            ref="uploadFile"
            style="display: none"
            type="file"
            accept="image/*"
            multiple="false"
            :value="fileValue"
            @change="changeUpload"
    ></input>
</template>

<script>
    export default {
        name: "pt-upload",
        props: {
            properties: { // 所有原生属性
                type: Object,
                default: () => ({
                    multiple: false,
                    accept: "image/*",
                })
            }
        },
        data() {
            return {
                fileValue: ""
            }
        },
        mounted() {
            for (let item in this.properties) {
                this.$refs.uploadFile[item] = this.properties[item]
            }
        },
        methods: {
            upload() {
                this.$refs.uploadFile.dispatchEvent(new MouseEvent("click"))
            },
            changeUpload({target}) {
                const _this = this;
                const {files} = target;
                if (files.length > 0) {
                    let formData = new FormData();
                    const [ file ] = files;
                    // if (file && (file.size / 1024 / 1024) > 50) {
                    //     this.$message.warning('Please upload pictures less than 40M !')
                    // } else
                        if (file) {
                        let reader = new FileReader();
                        reader.onload = function ({target: { result }}) {
                            let data = new Uint8Array(result)
                            if (data.length > 8
                                && data[0] === 137
                                && data[1] === 80
                                && data[2] === 78
                                && data[3] === 71
                                && data[4] === 13
                                && data[5] === 10
                                && data[6] === 26
                                && data[7] === 10
                            ) {
                                formData.append('files[]', file)
                            } else if (data.length > 2
                                && data[0] === 0xFF
                                && data[1] === 0xD8
                            ) {
                                formData.append('files[]', file)
                            } else {
                                _this.$message.warning("Please upload pictures in jpeg, png, jpg format")
                                return;
                            }
                            _this.$emit("change-upload", formData);
                        }
                        reader.readAsArrayBuffer(file);
                    }
                }
                this.fileValue = "";
            }
        }
    }
</script>
