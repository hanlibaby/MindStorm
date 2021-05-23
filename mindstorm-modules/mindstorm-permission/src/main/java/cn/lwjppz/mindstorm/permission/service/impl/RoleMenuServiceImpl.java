package cn.lwjppz.mindstorm.permission.service.impl;

import cn.lwjppz.mindstorm.permission.mapper.RoleMenuMapper;
import cn.lwjppz.mindstorm.permission.model.dto.roleMenu.RoleMenuDTO;
import cn.lwjppz.mindstorm.permission.model.entity.Menu;
import cn.lwjppz.mindstorm.permission.model.entity.Role;
import cn.lwjppz.mindstorm.permission.model.entity.RoleMenu;
import cn.lwjppz.mindstorm.permission.service.MenuService;
import cn.lwjppz.mindstorm.permission.service.RoleMenuService;
import cn.lwjppz.mindstorm.permission.service.RoleService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 角色权限表 服务实现类
 * </p>
 *
 * @author lwj
 * @since 2021-05-09
 */
@Service
public class RoleMenuServiceImpl extends ServiceImpl<RoleMenuMapper, RoleMenu> implements RoleMenuService {

    @Autowired
    private MenuService menuService;

    @Autowired
    private RoleService roleService;

    @Override
    public RoleMenuDTO getMenusByRoleId(@NonNull String roleId) {
        Assert.hasText(roleId, "RoleId must not be empty!");

        LambdaQueryWrapper<RoleMenu> queryWrapper = Wrappers.lambdaQuery();
        queryWrapper.eq(RoleMenu::getRoleId, roleId);

        List<RoleMenu> roleMenus = baseMapper.selectList(queryWrapper);

        List<String> checkedKeys = roleMenus.stream()
                .map(RoleMenu::getMenuId)
                .collect(Collectors.toList());

        Role role = roleService.selectRoleById(roleId);

        RoleMenuDTO roleMenuDTO = new RoleMenuDTO();
        roleMenuDTO.setRoleId(roleId);
        roleMenuDTO.setRoleName(role.getRoleName());
        roleMenuDTO.setRemark(role.getRemark());
        roleMenuDTO.setCheckedKeys(checkedKeys);

        return roleMenuDTO;
    }

    @Override
    public boolean insertRoleMenu(String roleId, List<String> menus) {
        // 新增角色菜单之前先将原来的关联删除
        deleteRoleMenu(roleId);

        menus.forEach(v -> {
            RoleMenu roleMenu = new RoleMenu();
            roleMenu.setRoleId(roleId);
            roleMenu.setMenuId(v);
            baseMapper.insert(roleMenu);
        });

        return true;
    }

    @Override
    public boolean deleteRoleMenu(@NonNull String roleId) {
        LambdaQueryWrapper<RoleMenu> queryWrapper = Wrappers.lambdaQuery();
        queryWrapper.eq(RoleMenu::getRoleId, roleId);

        baseMapper.delete(queryWrapper);

        return true;
    }

    @Override
    public boolean deleteRoleMenuByMenuId(String menuId) {
        LambdaQueryWrapper<RoleMenu> queryWrapper = Wrappers.lambdaQuery();
        queryWrapper.eq(RoleMenu::getMenuId, menuId);

        baseMapper.delete(queryWrapper);

        return true;
    }

    @Override
    public List<String> getMenuIdsByRoleId(String roleId) {
        LambdaQueryWrapper<RoleMenu> queryWrapper = Wrappers.lambdaQuery();
        queryWrapper.eq(RoleMenu::getRoleId, roleId);

        List<RoleMenu> roleMenus = baseMapper.selectList(queryWrapper);
        return roleMenus.stream()
                .map(RoleMenu::getMenuId)
                .collect(Collectors.toList());
    }
}