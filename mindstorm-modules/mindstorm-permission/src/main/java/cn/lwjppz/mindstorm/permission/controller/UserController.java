package cn.lwjppz.mindstorm.permission.controller;

import cn.lwjppz.mindstorm.common.core.enums.type.LogType;
import cn.lwjppz.mindstorm.common.core.enums.status.UserStatus;
import cn.lwjppz.mindstorm.common.core.support.CommonResult;
import cn.lwjppz.mindstorm.common.core.support.ValueEnum;
import cn.lwjppz.mindstorm.common.log.annotation.Log;
import cn.lwjppz.mindstorm.common.security.annotation.PreAuthorize;
import cn.lwjppz.mindstorm.permission.model.dto.user.UserDTO;
import cn.lwjppz.mindstorm.permission.model.dto.user.UserDetailDTO;
import cn.lwjppz.mindstorm.permission.model.vo.user.SearchUserVO;
import cn.lwjppz.mindstorm.permission.model.vo.user.UserVO;
import cn.lwjppz.mindstorm.permission.service.UserService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author lwj
 * @since 2021-05-09
 */
@Api(tags = "用户控制器")
@RestController
@RequestMapping("permission/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation("分页获取用户信息")
    @GetMapping("/list/{pageIndex}/{pageSize}")
    public CommonResult pageBy(@ApiParam("第几页") @PathVariable("pageIndex") Integer pageIndex,
                               @ApiParam("每页条数") @PathVariable("pageSize") Integer pageSize) {
        IPage<UserDTO> page = userService.pageByUsers(pageIndex, pageSize);
        return CommonResult.ok().data("page", page);
    }

    @ApiOperation("获取所有用户信息（选择组件）")
    @GetMapping("/list/select")
    public CommonResult listUserSelect() {
        var userSelects = userService.convertToUserSelectDTO(userService.list());
        return CommonResult.ok().data("userSelects", userSelects);
    }

    @ApiOperation("多条件查询用户信息")
    @PostMapping("/search")
    public CommonResult pageBySearch(
            @ApiParam("查询表单信息") @RequestBody SearchUserVO searchUserVO) {
        IPage<UserDTO> page = userService.pageBySearchUser(searchUserVO);
        return CommonResult.ok().data("page", page);
    }

    @ApiOperation("获取用户信息")
    @GetMapping("/info/{username}")
    public CommonResult infoByUserName(@ApiParam("用户名") @PathVariable("username") String username) {
        var loginUserDTO = userService.selectUserByUserName(username);
        return CommonResult.ok().data("user", loginUserDTO);
    }

    @ApiOperation("根据用户Id获取用户信息")
    @GetMapping("/infoById/{userId}")
    public CommonResult infoByUserId(@ApiParam("用户Id") @PathVariable("userId") String userId) {
        UserDetailDTO user = userService.convertToUserDetailDTO(userService.selectUserByUserId(userId));
        return CommonResult.ok().data("user", user);
    }

    @ApiOperation("根据用户Id获取用户信息（远程调用）")
    @GetMapping("/info/remote/{userId}")
    public CommonResult remoteInfoUser(@ApiParam("用户Id") @PathVariable("userId") String userId) {
        var userTo = userService.convertToUserTo(userService.selectUserByUserId(userId));
        return CommonResult.ok().data("userTo", userTo);
    }

    @ApiOperation("新增用户")
    @PostMapping("/create/admin")
    public CommonResult createAdmin(@ApiParam("用户信息") @RequestBody UserVO userVO) {
        var user = userService.insertUser(userVO);
        return CommonResult.ok().data("user", user);
    }

    @ApiOperation("修改用户信息")
    @PostMapping("/update")
    public CommonResult update(@ApiParam("用户信息") @RequestBody UserVO userVO) {
        var user = userService.updateUser(userVO);
        return CommonResult.ok().data("user", user);
    }

    @ApiOperation("删除用户")
    @DeleteMapping("/delete/{userId}")
    public CommonResult delete(@ApiParam("用户Id") @PathVariable("userId") String userId) {
        boolean b = userService.deleteUser(userId);
        return CommonResult.ok().data("delete", b);
    }

    @ApiOperation("更改用户状态")
    @GetMapping("/change")
    public CommonResult change(@ApiParam("用户Id") @RequestParam("userId") String userId,
                               @ApiParam("用户状态") @RequestParam("status") Integer status) {
        var userStatus = ValueEnum.valueToEnum(UserStatus.class, status);
        boolean b = userService.changeUserStatus(userId, userStatus);
        return CommonResult.ok().data("change", b);
    }

}
