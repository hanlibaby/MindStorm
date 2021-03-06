package cn.lwjppz.mindstorm.education.model.vo.courseclassstudent;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * <p></p>
 *
 * @author : lwj
 * @since : 2021-07-15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CourseClassStudentVO {

    @ApiModelProperty(value = "班级Id")
    private String classId;

    @ApiModelProperty(value = "学生姓名")
    private String realName;

    @ApiModelProperty(value = "学生手机号/学号")
    private String phoneOrSno;

}
