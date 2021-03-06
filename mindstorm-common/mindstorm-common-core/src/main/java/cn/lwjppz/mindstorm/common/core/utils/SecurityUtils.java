package cn.lwjppz.mindstorm.common.core.utils;

import cn.lwjppz.mindstorm.common.core.constant.CacheConstants;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * <p>
 * 权限获取工具类
 * </p>
 *
 * @author : lwj
 * @since : 2021-05-15
 */
public class SecurityUtils {

    private SecurityUtils() {
    }

    /**
     * 获取用户
     */
    public static String getUsername() {
        String username = Objects.requireNonNull(ServletUtils.getRequest()).getHeader(CacheConstants.DETAILS_USERNAME);
        return ServletUtils.urlDecode(username);
    }

    /**
     * 获取请求token
     */
    public static String getToken() {
        return getToken(ServletUtils.getRequest());
    }

    /**
     * 根据request获取请求token
     */
    public static String getToken(HttpServletRequest request) {
        String token = Objects.requireNonNull(ServletUtils.getRequest()).getHeader(CacheConstants.HEADER);
        if (StringUtils.hasText(token) && token.startsWith(CacheConstants.TOKEN_PREFIX)) {
            token = token.replace(CacheConstants.TOKEN_PREFIX, "");
        }
        return token;
    }

    /**
     * 是否为管理员
     *
     * @param userId 用户ID
     * @return 结果
     */
    public static boolean isAdmin(Long userId) {
        return userId != null && 1L == userId;
    }

    /**
     * 判断密码是否相同
     *
     * @param rawPassword     真实密码
     * @param encodedPassword 加密后字符
     * @return 结果
     */
    public static boolean matchesPassword(String rawPassword, String encodedPassword) {
        return BCrypt.checkpw(rawPassword, encodedPassword);
    }
}
