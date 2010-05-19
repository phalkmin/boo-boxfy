<?php

// insert options for boo-box
function booboxfy_config_page() 
{
	if (function_exists("add_submenu_page")) 
	{
		add_submenu_page("options-general.php", __("boo-box settings", "booboxfy"), __("boo-box settings", "booboxfy"), "manage_options", "boobox-config", "booboxfy_config_submenu");
	}
}

// the config page
function booboxfy_config_submenu() 
{
	$boo_formats =  array(
		"bbb" => array("text" => "Leaderboard (728 x 90) Large Ads"	, "limit" => "8"),
		"bbc" => array("text" => "Banner (468 x 60)"				, "limit" => "7"),
		"bbd" => array("text" => "Half Banner (234x60)"				, "limit" => "4"),
		"bbe" => array("text" => "Button (125x125) Small Ads"		, "limit" => "4"),
		"bbf" => array("text" => "Button (125x125) Large Ads"		, "limit" => "1"),
		"bbg" => array("text" => "Skyscraper (120x480)"				, "limit" => "5"),
		"bbh" => array("text" => "Skyscraper (120x600)"				, "limit" => "5"),
		"bbi" => array("text" => "Wide Skyscraper (160x600)"		, "limit" => "10"),
		"bbj" => array("text" => "Small Rectangle (180x150)"		, "limit" => "4"),
		"bbk" => array("text" => "Vertical Banner (120 x 240)"		, "limit" => "2"),
		"bbl" => array("text" => "Small Square (200 x 200)"			, "limit" => "4"),
		"bbm" => array("text" => "Square (250 x 250)"				, "limit" => "4"),
		"bbn" => array("text" => "Medium Rectangle (300 x 250)"		, "limit" => "6"),
		"bbo" => array("text" => "Large Rectangle (336 x 280)"		, "limit" => "9")
	);

	// refresh user options
	if (isset($_POST["boo_booid"]) && isset($_POST["boo_boomail"])) 
	{
		// se trocar de e-mail, limpa as configurações
		if (get_option("boo_boomail") != $_POST["boo_boomail"]) 
		{
			delete_option("boo_booafflang");
			delete_option("boo_booaffid");
		}

		update_option("boo_boomail", $_POST["boo_boomail"]);
		update_option("boo_booid", $_POST["boo_booid"]);
	}

	if (isset($_POST['update_boobox'])) 
	{
		// quebra select do booaffid para salvar a lingua do afiliado também
		$affarray = split("=", $_POST["boo_booaffid"]);
		$booaffid = $affarray[0];
		$booafflang = $affarray[1];

		update_option("boo_booaffid", $booaffid);
		update_option("boo_booafflang", $booafflang);

		if ($_POST["boo_formats"] == "bpe") 
		{
			($_POST["boo_limit"] == "") ? update_option("boo_limit", "4") : update_option("boo_limit", $_POST["boo_limit"]);
			($_POST["boo_width"] == "") ? update_option("boo_width", "400") : update_option("boo_width", $_POST["boo_width"]);
			update_option("boo_formats", "");
		}
		else 
		{
			update_option("boo_limit", $boo_formats[$_POST["boo_formats"]]["limit"]);
			update_option("boo_formats", $_POST["boo_formats"]);
		}

		if ($_POST["boo_gettag"] == NULL) 
		{
			delete_option("boo_gettag");
		}
		else 
		{
			update_option("boo_gettag", true);
		}

		if ($_POST["boo_autotag"] == NULL) 
		{
			delete_option("boo_autotag");
		}
		else 
		{
			update_option("boo_autotag", true);
		}

		if ($_POST["boo_nohome"] == NULL) 
		{
			delete_option("boo_nohome");
		}
		else 
		{
			update_option("boo_nohome", true);
		}
		?>
<div class="updated"><p><?php echo __("Saved.", "booboxfy"); ?></p></div>
		<?php
	}
	// config html
	// mostra campo para edição de e-mail
	?>
	<div class="wrap" id="booboxfy_option">
		<h2>boo-box</h2>
		<h3><?php echo __("boo-box profile", "booboxfy"); ?></h3>
		<form method="post" id="boo_mail_options">
			<table class="form-table">
				<tbody>
					<tr valign="top">
						<th scope="row">
							<label for="boo_boomail"><?php echo __("your boo-profile e-mail", "booboxfy"); ?>:</label>
						</th>
						<td>
							<input name="boo_boomail" type="text" id="boo_boomail" value="<?php echo !get_option("boo_boomail") ? get_option("admin_email") : get_option("boo_boomail") ; ?>" size="25" />
							<?php if (!get_option("boo_booid") && !get_option("boo_booaffid") && !get_option("boo_boomail") && (!get_option("admin_email") || get_option("admin_email") == "")) { ?>
							<br /><span class="boo_tip"><?php echo __("e-mail not registered", "booboxfy"); ?>. <a href="http://boo-box.com/profile/" target="_blank"><?php echo __('Create your boo-box account', 'booboxfy'); ?></a> </span>
							<?php }; ?>
							<p>
								<input name="boo_booid" type="hidden" id="boo_booid" value="<?php echo get_option("boo_booid"); ?>" size="25" />
								<div class="submit"><input type="submit" id="boo_updateid" name="boo_updateid" value="<?php echo __("Check", "booboxfy"); ?>" style="font-weight:bold;" />
								<?php if (!get_option("boo_booid")) { ?>
									| <a href="http://boo-box.com/site/setup/signup" target="_blank"><?php echo __("create your boo-box account", "booboxfy"); ?></a>
								<?php } ?>
								</div>
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
		<script type="text/javascript">
			// functions are inside boo-boxfy-config.js
			bb_mailform();
		</script>
		<!-- Opções avançadas -->
		<a id="boo_advanced_button" class="button" href="javascript:void(0);"><?php echo __("Advanced options", "booboxfy"); ?></a>
		<form method="post">
			<div id="boo_advanced_options" style="display:none">
        <input type="hidden" name="boo_booid" value="" />
        <input type="hidden" name="boo_boomail" value="" />
				<h3><?php echo __("Blog Settings", "booboxfy"); ?></h3>
				<table class="form-table">
					<tbody>
						<tr valign="top">
							<th scope="row">
								<label for="boo_autotag"><?php echo __("boo-box automatic links", "booboxfy"); ?></label>
							</th>
							<td>
								<input type="checkbox" name="boo_autotag" id="boo_autotag" <?php if (get_option("boo_autotag")) { echo "checked=\"checked\""; } ?> /> <label for="boo_autotag"><?php echo __("Enable automatic links", "booboxfy"); ?></label>
							</td>
						</tr>
						<tr valign="top">
							<th scope="row">
								<label for="boo_shopid"><?php echo __("e-commerce reference code", "booboxfy"); ?>:</label>
							</th>
							<td>
								<span id="boo_booaffid">Loading...</span>
								<p><a class="button" href="http://boo-box.com/profile/index" target="_blank"><?php echo __("Modify affiliate", "booboxfy"); ?></a></p>
							</td>
						</tr>
					</tbody>
				</table>
				<h3><?php echo __("Widget", "booboxfy"); ?></h3>
				<script type="text/javascript" charset="utf-8">
					$ = jQuery;
					$(document).ready( function() 
					{
						var cmanual = $('#bpe');
						var wtags = $('.boo_pe_advanced');
						var cpost = $('ul#widgets-formats input:radio[value^=bb]');

						wtags[(cmanual.is(':checked')) ? 'show' : 'hide']();
						cmanual.change(function() {wtags.show()});
						cpost.change(function() {wtags.hide()});
					});
				</script>

				<table class="form-table">
					<tbody>
						<tr valign="top">
							<th scope="row">
								<label for="boo_formats"><?php echo __("Format", "booboxfy"); ?>:</label>
							</th>
							<td>
								<ul style="list-style:none" id="widgets-formats">
									<?php
										$boo_widgets_list = "";
										foreach ($boo_formats as $format=>$prop) 
										{
											$boo_widgets_isFormat = (get_option("boo_formats") && get_option("boo_formats") == $format) ? "checked=\"checked\"" : "";
											$boo_widgets_list .= "<li><input type=\"radio\" class=\"radio\" name=\"boo_formats\" value=\"" . $format . "\" id=\"" . $format . "\" " . $boo_widgets_isFormat . " /> <label for=\"" . $format . "\">" . $prop["text"] . "</label></li>";
										}
										echo $boo_widgets_list;
										$boo_widgets_pe = (!get_option("boo_formats") || get_option("boo_formats") == "bpe") ? "checked=\"checked\"" : "";
									?>
									<li><input type="radio" class="radio" name="boo_formats" value="bpe" id="bpe" <?php echo $boo_widgets_pe ?> /> <label for="bpe">Custom</label></li>
								</ul>
							</td>
						</tr>
						<tr class="boo_pe_advanced">
							<th scope="row">
								<label for="boo_limit"><?php echo __("Product limit per widget", "booboxfy"); ?>:</label>
							</th>
							<td>
								<select name="boo_limit">
									<?php
									for ($i = 1; $i <= 12; $i++) 
									{
										$select = ((int)get_option("boo_limit") == $i) ? "selected=\"selected\"" : "";
										echo "<option value=\"" . $i . "\" " . $select . ">" . $i . "</option>";
									}
									?>
								</select>
							</td>
						</tr>
						<tr class="boo_pe_advanced">
							<th scope="row">
								<label for="boo_width"><?php echo __("Width", "booboxfy"); ?>:</label>
							</th>
							<td>
								<input name="boo_width" type="text" id="boo_width" value="<?php echo get_option("boo_width"); ?>" size="10" />px
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="boo_width"><?php echo __("More", "booboxfy"); ?>:</label>
							</th>
							<td>
								<ul style="list-style:none">
									<li><input type="checkbox" name="boo_gettag" id="boo_gettag" <?php if (get_option("boo_gettag")) { echo "checked=\"checked\""; } ?> /> <label for="boo_gettag"><?php echo __("Use the last tag on the post to search products on the widget, in case the defined tag is not specific to boo-box.", "booboxfy"); ?></label></li>
									<li><input type="checkbox" name="boo_nohome" id="boo_nohome" <?php if (get_option("boo_nohome")) { echo "checked=\"checked\""; } ?> /> <label for="boo_nohome"><?php echo __("Not display widget in home", "booboxfy"); ?></label></li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p><div class="submit"><input type="submit" class="button-primary" name="update_boobox" value="<?php echo __("Save Options", "booboxfy"); ?> &raquo;" /></div></p>
		</form>
		<!--Fim de opções avançadas -- >
		<p><?php echo __("If you have questions or doubts, please contact us at:", "booboxfy"); ?> <a href="mailto:contact@boo-box.com">contact@boo-box.com</a></p>
	</div>
<?php
} // end of config page

if (!get_option("boo_booid") && get_option("admin_email")) 
{
	function booboxfy_config_automatic() 
	{
		if ($_GET["page"] != "boobox-config") 
		{
			echo "<div id=\"boo-warning\" class=\"updated fade\"><p><strong>" . __("boo-box is almost ready", "booboxfy") . ".</strong> <a href=\"options-general.php?page=boobox-config\">Your boo-boxfy has been automatic configured. Please check your email in the settings.</a></p></div>";
		}

		//reseta o autotagging e o widget
		update_option("boo_autotag", true);
		update_option("boo_gettag", true);
	}

	add_action("admin_notices", "booboxfy_config_automatic");
}
else if ( !get_option("boo_booid") && !get_option("boo_booaffid") && !isset($_POST["update_boobox"])) 
{
	function booboxfy_config_warning() 
	{
		if ($_GET["page"] != "boobox-config") 
		{
			echo "<div id=\"boo-warning\" class=\"updated fade\"><p><strong>" . __("boo-box is almost ready", "booboxfy") . ".</strong> <a href=\"options-general.php?page=boobox-config\">" . __("You must configure it to work.", "booboxfy") . "</a></p></div>";
		}

		//reseta o autotagging e o widget
		update_option("boo_autotag", true);
		update_option("boo_gettag", true);
	}

	add_action("admin_notices", "booboxfy_config_warning");
}

// hook
add_action("admin_menu", "booboxfy_config_page");

?>
