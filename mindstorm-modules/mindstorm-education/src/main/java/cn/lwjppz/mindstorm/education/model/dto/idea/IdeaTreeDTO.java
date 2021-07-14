package cn.lwjppz.mindstorm.education.model.dto.idea;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * <p></p>
 *
 * @author : lwj
 * @since : 2021-06-05
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class IdeaTreeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String pid;

    private String name;

    private String description;

    private Integer sort;

    private Date gmtCreate;

    private List<IdeaTreeDTO> children;

}
