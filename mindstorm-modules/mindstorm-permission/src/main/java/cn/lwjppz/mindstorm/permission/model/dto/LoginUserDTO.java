package cn.lwjppz.mindstorm.permission.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

/**
 * <p></p>
 *
 * @author : lwj
 * @since : 2021-05-15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LoginUserDTO {

    private static final long serialVersionUID = 1L;

    /**
     * 用户唯一标识
     */
    private String token;

    /**
     * 用户Id
     */
    private String id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户状态
     */
    private Integer status;

    /**
     * 过期时间
     */
    private Long expireTime;

    /**
     * 登录时间
     */
    private long loginTime;

    /**
     * 头像地址
     */
    private String avatar;

    /**
     * 登录IP地址
     */
    private String ipaddr;

    /**
     * 用户所拥有的权限
     */
    private Set<String> permissions;

    /**
     * 用户所属角色
     */
    private Set<String> roles;
}