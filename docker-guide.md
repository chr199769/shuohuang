# Docker构建和运行指南

## 构建Docker镜像

在项目根目录下运行以下命令构建Docker镜像：

```bash
docker build -t frontend-app .
```

这将创建一个名为`frontend-app`的Docker镜像。

## 运行Docker容器

构建完成后，使用以下命令运行容器：

```bash
docker run -d -p 8080:443 --name frontend-container frontend-app
```

这将启动容器并将容器内的443端口映射到主机的8080端口。

## 访问应用

应用启动后，可以通过浏览器访问：

```
https://localhost:8080
```

> 提示：容器内使用自签名证书提供 HTTPS，首次访问浏览器可能提示不受信任，选择继续访问或在浏览器中信任该证书即可。

## 停止和删除容器

停止容器：

```bash
docker stop frontend-container
```

删除容器：

```bash
docker rm frontend-container
```

## 其他有用的命令

查看所有容器：

```bash
docker ps -a
```

查看所有镜像：

```bash
docker images
```

删除镜像：

```bash
docker rmi frontend-app
```
## 镜像打包与服务器加载

### 保存镜像为 tar 包

```bash
# 如未构建，请先构建镜像（默认标签 latest）
docker build -t frontend-app .

# 保存镜像到本地 tar 包
docker save -o frontend-app.tar frontend-app:latest
```

### 传输到服务器

- 使用 `scp`：
  ```bash
  scp frontend-app.tar user@server:/opt/images/
  ```
- 或使用 SFTP/WinSCP 图形工具上传到服务器指定路径。

### 在服务器加载镜像

```bash
# 登录服务器后
docker load -i /opt/images/frontend-app.tar

# 验证镜像是否已加载
docker images | grep frontend-app
```

### 运行容器（HTTPS，映射 8080→443）

```bash
docker run -d -p 8080:443 --name frontend-container frontend-app:latest
```

### 体积优化（压缩传输）

```bash
# 在本地压缩保存
docker save frontend-app:latest | gzip > frontend-app.tar.gz

# 服务器加载（两种方式任选其一）
gunzip -c frontend-app.tar.gz | docker load
# 或
docker load -i frontend-app.tar.gz
```

### 多架构注意（服务器架构与本机不同）

```bash
# 以 linux/amd64 为例，构建并直接加载到本地 Docker
docker buildx build --platform linux/amd64 -t frontend-app:latest --load .

# 然后按上述步骤保存为 tar 并传输/加载
docker save -o frontend-app.tar frontend-app:latest
```

### 常见问题

- 请使用 `docker save`/`docker load`，不要用 `docker export`/`docker import`（后者是容器文件系统快照，会丢失镜像元数据与标签）。
- 首次访问 `https://localhost:8080` 可能提示证书不受信任，选择继续访问或在浏览器中信任该证书即可。
