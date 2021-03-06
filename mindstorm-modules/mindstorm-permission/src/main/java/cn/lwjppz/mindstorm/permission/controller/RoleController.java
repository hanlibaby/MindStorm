package cn.lwjppz.mindstorm.permission.controller;


import cn.lwjppz.mindstorm.common.core.enums.type.LogType;
import cn.lwjppz.mindstorm.common.core.support.CommonResult;
import cn.lwjppz.mindstorm.common.log.annotation.Log;
import cn.lwjppz.mindstorm.common.security.annotation.PreAuthorize;
import cn.lwjppz.mindstorm.permission.model.dto.role.RoleDTO;
import cn.lwjppz.mindstorm.permission.model.dto.role.SimpleRoleDTO;
import cn.lwjppz.mindstorm.permission.model.entity.Role;
import cn.lwjppz.mindstorm.permission.model.vo.role.RoleVO;
import cn.lwjppz.mindstorm.permission.model.vo.role.SearchRoleVO;
import cn.lwjppz.mindstorm.permission.service.RoleService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 角色信息表 前端控制器
 * </p>
 *
 * @author lwj
 * @since 2021-05-09
 */
@RestController
@RequestMapping("/permission/role")
@Api(tags = "角色控制器")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @ApiOperation("分页角色信息")
    @GetMapping("/page/{pageIndex}/{pageSize}")
    @PreAuthorize(hasPermission = "permission:role:list")
    public CommonResult pageBy(@ApiParam("pageIndex") @PathVariable("pageIndex") String pageIndex,
                               @ApiParam("pageSize") @PathVariable("pageSize") String pageSize) {
        IPage<RoleDTO> page = roleService.pageBy(Integer.parseInt(pageIndex), Integer.parseInt(pageSize));
        return CommonResult.ok().data("pageRoles", page);
    }

    @ApiOperation("根据查询条件查询角色列表")
    @PostMapping("/search")
    @PreAuthorize(hasPermission = "permission:role:query")
    public CommonResult pageBySearch(@ApiParam("查询信息") @RequestBody SearchRoleVO searchRoleVO) {
        IPage<RoleDTO> page = roleService.queryPageRole(searchRoleVO);
        return CommonResult.ok().data("searchRoles", page);
    }

    @ApiOperation("获取所有角色")
    @GetMapping("/list")
    @PreAuthorize(hasPermission = "permission:role:list")
    public CommonResult listRoles() {
        List<Role> roles = roleService.listRoles();
        return CommonResult.ok().data("roles", roles);
    }

    @ApiOperation("获取所有未禁用角色")
    @GetMapping("/list/un-disable")
    public CommonResult listUnDisableRoles() {
        List<SimpleRoleDTO> roles = roleService.convertToSimpleRoleDTO(roleService.listUnDisableRoles());
        return CommonResult.ok().data("roles", roles);
    }

    @ApiOperation("新增角色")
    @PostMapping("/create")
    @Log(operateModule = "角色管理", logType = LogType.INSERT)
    @PreAuthorize(hasPermission = "permission:role:add")
    public CommonResult create(@ApiParam("角色信息") @RequestBody RoleVO roleVO) {
        RoleDTO roleDTO = roleService.convertToRoleDTO(roleService.insertRole(roleVO));
        return CommonResult.ok().data("role", roleDTO);
    }

    @ApiOperation("修改角色信息")
    @PostMapping("/update")
    @Log(operateModule = "角色管理", logType = LogType.UPDATE)
    @PreAuthorize(hasPermission = "permission:role:update")
    public CommonResult update(@ApiParam("角色信息") @RequestBody RoleVO roleVO) {
        RoleDTO roleDTO = roleService.convertToRoleDTO(roleService.updateRole(roleVO));
        return CommonResult.ok().data("role", roleDTO);
    }

    @ApiOperation("根据角色Id获取角色信息")
    @GetMapping("/info/{roleId}")
    public CommonResult info(@ApiParam("roleId") @PathVariable("roleId") String roleId) {
        RoleDTO roleDTO = roleService.convertToRoleDTO(roleService.selectRoleById(roleId));
        return CommonResult.ok().data("role", roleDTO);
    }

    @ApiOperation("根据角色Id删除角色")
    @DeleteMapping("/delete/{roleId}")
    @Log(operateModule = "角色管理", logType = LogType.DELETE)
    @PreAuthorize(hasPermission = "permission:role:delete")
    public CommonResult delete(@ApiParam("roleId") @PathVariable("roleId") String roleId) {
        boolean b = roleService.deleteRoleById(roleId);
        return CommonResult.ok().data("delete", b);
    }

    @ApiOperation("批量删除角色")
    @PostMapping("/delete-batch")
    @Log(operateModule = "角色管理", logType = LogType.DELETE)
    public CommonResult delete(@ApiParam("roleIds") @RequestBody List<String> roleIds) {
        boolean b = roleService.deleteBatchRoles(roleIds);
        return CommonResult.ok().data("delete", b);
    }

    @ApiOperation("更改角色状态")
    @GetMapping("/change/{roleId}/{status}")
    @Log(operateModule = "角色管理", logType = LogType.UPDATE)
    @PreAuthorize(hasPermission = "permission:role:status")
    public CommonResult disable(@ApiParam("roleId") @PathVariable("roleId") String roleId,
                                @ApiParam("status") @PathVariable("status") Integer status) {
        boolean b = roleService.changeRoleStatus(roleId, status);
        return CommonResult.ok().data("change", b);
    }

}

