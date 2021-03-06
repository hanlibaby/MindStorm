package cn.lwjppz.mindstorm.common.security.annotation;

import cn.lwjppz.mindstorm.common.security.config.ApplicationConfig;
import cn.lwjppz.mindstorm.common.security.feign.FeignAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;

import java.lang.annotation.*;

/**
 * <p>
 * 开启默认配置注解
 * </p>
 *
 * @author : lwj
 * @since : 2021-05-25
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@EnableAspectJAutoProxy(exposeProxy = true)
@EnableAsync
@EnableDiscoveryClient
@Import({FeignAutoConfiguration.class, ApplicationConfig.class})
public @interface EnableCustomConfig {
}
