const { Adw, Gio, GObject } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Convenience = Me.imports.convenience;
const ShortcutWidget = Me.imports.shortcut;

const PrefsWidget = GObject.registerClass({
    GTypeName: 'PrefsWidget',
    Template: Me.dir.get_child('./ui/prefs.ui').get_uri(),
    InternalChildren: [
        'show_all_slider_switch',
        'only_all_slider_switch',
        'show_value_label_switch',
        'show_display_name_switch',
        'show_osd_switch',
        'button_location_combo_row',
        'hide_system_indicator_row',
        'hide_system_indicator_switch',
        'position_system_indicator_row',
        'position_system_indicator_spin_button',
        'position_system_menu_row',
        'position_system_menu_spin_button',
        'increase_shortcut_button',
        'decrease_shortcut_button',
        'step_keyboard_spin_button',
        'ddcutil_binary_path_entry',
        'sleep_multiplier_spin_button',
        'queue_ms_spin_button',
        'allow_zero_brightness_switch',
        'disable_display_state_check_switch',
        'verbose_debugging_switch'
    ],
}, class PrefsWidget extends Adw.PreferencesPage {

    _init(params = {}) {
        super._init(params);
        this.settings = ExtensionUtils.getSettings();
        this.settings.bind(
            'show-all-slider',
            this._show_all_slider_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'only-all-slider',
            this._only_all_slider_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-value-label',
            this._show_value_label_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-display-name',
            this._show_display_name_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'show-osd',
            this._show_osd_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._button_location_combo_row.selected = this.settings.get_int('button-location');

        if (this._button_location_combo_row.selected === 0) {
            this._hide_system_indicator_row.sensitive = false;
            this._position_system_menu_row.sensitive = false;
        }

        this.settings.bind(
            'hide-system-indicator',
            this._hide_system_indicator_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this._position_system_indicator_spin_button.value = this.settings.get_double('position-system-indicator');
        this._position_system_menu_spin_button.value = this.settings.get_double('position-system-menu');
        this._step_keyboard_spin_button.value = this.settings.get_double('step-change-keyboard');
        this._ddcutil_binary_path_entry.set_text(this.settings.get_string('ddcutil-binary-path'))
        this._sleep_multiplier_spin_button.value = this.settings.get_double('ddcutil-sleep-multiplier');
        this._queue_ms_spin_button.value = this.settings.get_double('ddcutil-queue-ms');
        
        this.settings.bind(
            'allow-zero-brightness',
            this._allow_zero_brightness_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'disable-display-state-check',
            this._disable_display_state_check_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        this.settings.bind(
            'verbose-debugging',
            this._verbose_debugging_switch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        

        this.settings.connect('changed::increase-brightness-shortcut', () => {
            this._increase_shortcut_button.keybinding = this.settings.get_strv('increase-brightness-shortcut')[0];
        });
        this._increase_shortcut_button.connect('notify::keybinding', () => {
            this.settings.set_strv('increase-brightness-shortcut', [this._increase_shortcut_button.keybinding]);
        });
        this._increase_shortcut_button.keybinding = this.settings.get_strv('increase-brightness-shortcut')[0];

        this.settings.connect('changed::decrease-brightness-shortcut', () => {
            this._decrease_shortcut_button.keybinding = this.settings.get_strv('decrease-brightness-shortcut')[0];
        });
        this._decrease_shortcut_button.connect('notify::keybinding', () => {
            this.settings.set_strv('decrease-brightness-shortcut', [this._decrease_shortcut_button.keybinding]);
        });
        this._decrease_shortcut_button.keybinding = this.settings.get_strv('decrease-brightness-shortcut')[0];

        this._position_system_indicator_row.sensitive = !this.settings.get_boolean('hide-system-indicator');
        this.settings.connect('changed::hide-system-indicator', () => {
            this._position_system_indicator_row.sensitive = !this.settings.get_boolean('hide-system-indicator');
        });
    }

    onButtonLocationChanged() {
        this.settings.set_int('button-location', this._button_location_combo_row.selected);
        if (this._button_location_combo_row.selected === 0) {
            this._hide_system_indicator_row.sensitive = false;
            this._position_system_indicator_row.sensitive = false;
            this._position_system_menu_row.sensitive = false;
        } else {
            this._hide_system_indicator_row.sensitive = true;
            this._position_system_menu_row.sensitive = true;
            this._position_system_indicator_row.sensitive = !this.settings.get_boolean('hide-system-indicator');
        }
    }
    onMenuPositionValueChanged() {
        this.settings.set_double('position-system-menu', this._position_system_menu_spin_button.value);
    }

    onIndicatorPositionValueChanged() {
        this.settings.set_double('position-system-indicator', this._position_system_indicator_spin_button.value);
    }
    onStepKeyboardValueChanged() {
        this.settings.set_double('step-change-keyboard', this._step_keyboard_spin_button.value);
    }
    onDdcutilBinaryPathChanged() {
        this.settings.set_string('ddcutil-binary-path', this._ddcutil_binary_path_entry.get_text());
    }
    onSleepMultiplierValueChanged() {
        this.settings.set_double('ddcutil-sleep-multiplier', this._sleep_multiplier_spin_button.value);
    }
    onQueueMsValueChanged() {
        this.settings.set_double('ddcutil-queue-ms', this._queue_ms_spin_button.value);
    }
}
);

function init() {
    ExtensionUtils.initTranslations();
}

function fillPreferencesWindow(window) {
    window.set_size_request(500, 700);
    window.search_enabled = true;

    window.add(new PrefsWidget());
}
