# T-Ride

## 注意事項
1. 大家在使用時為了避免日後衝突請前後端在各自的branch開發
2. 剛開使用時，可以使用以下指令複製專案
    ```
    git clone https://github.com/poyingHAHA/T-Ride.git
    ```
3. 接下來可以用以下指令將遠端的分支拉到本地的branch上 (下面的指令會將遠端的frontend抓到本地的frontend這個branch)
    ```
    git fetch origin frontend:frontend
    ```
4. 使用以下指令檢查本地端的branch(`*`表示目前所在的branch)
    ```
    git branch
    ========output========
    * main
    frontend
    ======================  
    ```
5. 使用以下指令改變本地branch
    ```
    git checkout frontend
    git branch
    ========output========
    main
    * frontend
    ======================
    ```
6.  使用以下指令新增分支
    ```
    git branch localdev
    git branch
    git checkout localdev
    ========output========
    main
    frontend
    * localdev
    ======================
    ```
7. 大家盡量不要在main跟frontend這兩個本地分支上開發
8. 要push之前先照下面方式在本地端與遠端的分支merge，再push到遠端對應的分支
    ```
    git add .
    git commit -m "寫下當次的修改"
    git checkout frontend 
    git pull origin/frontend          # 本地frontend與遠端frontend合併
    git checkout localdev
    git merge frontend                 # localdev與frontend合併，注意這邊可能會有衝突
    git push origin frontend:frontend  # 遠端與本地端合併
    ```

## 專案資訊：
- Group: 6
- Subject: I am Uber
- [SLIDE LINK](https://docs.google.com/presentation/d/1FG-iQDyM9p_I1c0g6058Khn9A8mNElYN0KyC5c5p0GM/edit?usp=sharing)
- Frontend: React
- Backend: Flask
